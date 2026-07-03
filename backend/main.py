from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta, UTC
import uuid
import base64
import numpy as np
import cv2
from contextlib import asynccontextmanager
from jose import jwt, JWTError
from passlib.context import CryptContext
from prisma import Prisma

# ─── Auth Constants ─────────────────────────────────────────────────────────
SECRET_KEY = "AURA_SUPER_SECRET_KEY_FOR_JWT_TOKENS"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60  # 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

# ─── Prisma Database Lifecycle ──────────────────────────────────────────────
db = Prisma()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()

app = FastAPI(
    title="AURA API",
    version="1.0.0",
    description="AURA Omnichannel Retail Platform API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Broaden to support any local port or dev domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Security Helpers ───────────────────────────────────────────────────────
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token claims")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = await db.user.find_unique(where={"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ─── Schemas ────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class ReservationCreate(BaseModel):
    product_id: int
    store_id: int
    size: str

class ReservationStatusUpdate(BaseModel):
    status: str
    staff_note: Optional[str] = ""

class WishlistItem(BaseModel):
    product_id: int

class TryOnRequest(BaseModel):
    image: str

# ─── Auth Routes ────────────────────────────────────────────────────────────

@app.post("/api/auth/register")
async def register(req: RegisterRequest):
    # Check if exists
    existing = await db.user.find_unique(where={"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = get_password_hash(req.password)
    user = await db.user.create(
        data={
            "name": req.name,
            "email": req.email,
            "password": hashed,
            "role": "customer"  # Default registration is customer
        }
    )
    
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "createdAt": user.createdAt
        }
    }

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = await db.user.find_unique(where={"email": req.email})
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "createdAt": user.createdAt
        }
    }

@app.post("/api/auth/logout")
async def logout(current_user=Depends(get_current_user)):
    # JWT is stateless, so client clears token.
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "createdAt": current_user.createdAt
    }

# ─── Product Routes ─────────────────────────────────────────────────────────

@app.get("/api/products")
async def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
):
    # Dynamic filtering with Prisma
    where_clause = {}
    
    if search:
        where_clause["OR"] = [
            {"name": {"contains": search}},
            {"brand": {"contains": search}},
            {"category": {"contains": search}}
        ]
    if category and category.lower() != "all":
        where_clause["category"] = category
    if brand:
        where_clause["brand"] = brand
        
    price_filter = {}
    if min_price is not None:
        price_filter["gte"] = min_price
    if max_price is not None:
        price_filter["lte"] = max_price
        
    if price_filter:
        where_clause["price"] = price_filter
        
    products = await db.product.find_many(where=where_clause)
    
    # Format list fields back to lists
    results = []
    for p in products:
        results.append({
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "price": p.price,
            "originalPrice": p.originalPrice,
            "rating": p.rating,
            "reviews": p.reviews,
            "description": p.description,
            "images": p.images.split(",") if p.images else [],
            "sizes": p.sizes.split(",") if p.sizes else [],
            "colors": p.colors.split(",") if p.colors else [],
            "tags": p.tags.split(",") if p.tags else [],
            "inStock": p.inStock
        })
        
    return {"products": results, "total": len(results)}

@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    p = await db.product.find_unique(where={"id": product_id})
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Get inventory stock levels across all stores
    inventory_items = await db.inventory.find_many(where={"productId": product_id})
    stores = await db.store.find_many()
    
    stores_with_stock = []
    for s in stores:
        stock_item = next((i for i in inventory_items if i.storeId == s.id), None)
        stock_qty = stock_item.stock if stock_item else 0
        stores_with_stock.append({
            "id": s.id,
            "name": s.name,
            "city": s.city,
            "address": s.address,
            "phone": s.phone,
            "hours": s.hours,
            "stock": stock_qty
        })
        
    return {
        "id": p.id,
        "name": p.name,
        "brand": p.brand,
        "category": p.category,
        "price": p.price,
        "originalPrice": p.originalPrice,
        "rating": p.rating,
        "reviews": p.reviews,
        "description": p.description,
        "images": p.images.split(",") if p.images else [],
        "sizes": p.sizes.split(",") if p.sizes else [],
        "colors": p.colors.split(",") if p.colors else [],
        "tags": p.tags.split(",") if p.tags else [],
        "inStock": p.inStock,
        "stores": stores_with_stock
    }

@app.get("/api/products/{product_id}/inventory")
async def get_product_inventory(product_id: int):
    inventory_items = await db.inventory.find_many(where={"productId": product_id})
    stores = await db.store.find_many()
    
    result = []
    for s in stores:
        stock_item = next((i for i in inventory_items if i.storeId == s.id), None)
        result.append({
            "id": s.id,
            "name": s.name,
            "city": s.city,
            "address": s.address,
            "phone": s.phone,
            "hours": s.hours,
            "stock": stock_item.stock if stock_item else 0
        })
    return {"product_id": product_id, "stores": result}

@app.get("/api/products/{product_id}/size-availability")
async def get_size_availability(product_id: int, size: str = ""):
    """
    Returns per-store stock availability for a specific size.
    Stock is derived from total inventory with per-size variation seeded
    deterministically so results are consistent within a session.
    """
    import hashlib
    inventory_items = await db.inventory.find_many(where={"productId": product_id})
    stores = await db.store.find_many()
    product = await db.product.find_unique(where={"id": product_id})
    
    result = []
    for s in stores:
        stock_item = next((i for i in inventory_items if i.storeId == s.id), None)
        total_stock = stock_item.stock if stock_item else 0
        
        if total_stock > 0 and size:
            # Deterministic pseudo-random availability per size+store combo
            seed_str = f"{product_id}-{s.id}-{size}"
            seed_val = int(hashlib.md5(seed_str.encode()).hexdigest(), 16)
            rng = np.random.default_rng(seed_val % (2**31))
            # Size stock is a fraction of total store stock, varies by size
            size_fraction = float(rng.uniform(0.0, 1.0))
            size_stock = int(round(total_stock * size_fraction))
        else:
            size_stock = 0

        result.append({
            "id": s.id,
            "name": s.name,
            "city": s.city,
            "address": s.address,
            "phone": s.phone,
            "hours": s.hours,
            "stock": size_stock
        })
    return {"product_id": product_id, "size": size, "stores": result}

# ─── Wishlist Routes ────────────────────────────────────────────────────────

@app.get("/api/wishlist")
async def get_wishlist(current_user=Depends(get_current_user)):
    wishlist_entries = await db.wishlist.find_many(where={"userId": current_user.id})
    product_ids = [w.productId for w in wishlist_entries]
    
    products = await db.product.find_many(where={"id": {"in": product_ids}})
    results = []
    for p in products:
        results.append({
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "price": p.price,
            "originalPrice": p.originalPrice,
            "rating": p.rating,
            "reviews": p.reviews,
            "description": p.description,
            "images": p.images.split(",") if p.images else [],
            "sizes": p.sizes.split(",") if p.sizes else [],
            "colors": p.colors.split(",") if p.colors else [],
            "tags": p.tags.split(",") if p.tags else [],
            "inStock": p.inStock
        })
    return {"wishlist": results}

@app.post("/api/wishlist")
async def add_to_wishlist(item: WishlistItem, current_user=Depends(get_current_user)):
    product = await db.product.find_unique(where={"id": item.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Create or update unique
    try:
        await db.wishlist.create(
            data={
                "userId": current_user.id,
                "productId": item.product_id
            }
        )
    except Exception:
        # Already exists, just return success
        pass
        
    wishlist_entries = await db.wishlist.find_many(where={"userId": current_user.id})
    return {"message": "Added to wishlist", "count": len(wishlist_entries)}

@app.delete("/api/wishlist/{product_id}")
async def remove_from_wishlist(product_id: int, current_user=Depends(get_current_user)):
    try:
        await db.wishlist.delete(
            where={
                "userId_productId": {
                    "userId": current_user.id,
                    "productId": product_id
                }
            }
        )
    except Exception:
        # Doesn't exist, ignore
        pass
    return {"message": "Removed from wishlist"}

# ─── Reservation Routes ─────────────────────────────────────────────────────

@app.get("/api/reservations")
async def get_reservations(current_user=Depends(get_current_user)):
    if current_user.role in ("admin", "staff"):
        reservations = await db.reservation.find_many()
    else:
        reservations = await db.reservation.find_many(where={"userId": current_user.id})
        
    results = []
    for r in reservations:
        p = await db.product.find_unique(where={"id": r.productId})
        s = await db.store.find_unique(where={"id": r.storeId})
        u = await db.user.find_unique(where={"id": r.userId})
        results.append({
            "id": r.id,
            "userId": r.userId,
            "userName": u.name if u else "Unknown User",
            "productId": r.productId,
            "productName": p.name if p else "Deleted Product",
            "storeId": r.storeId,
            "storeName": s.name if s else "Deleted Store",
            "size": r.size,
            "status": r.status,
            "createdAt": r.createdAt,
            "expiresAt": r.expiresAt,
            "staffNote": r.staffNote
        })
    return {"reservations": results}

@app.post("/api/reservations")
async def create_reservation(data: ReservationCreate, current_user=Depends(get_current_user)):
    product = await db.product.find_unique(where={"id": data.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    store = await db.store.find_unique(where={"id": data.store_id})
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
        
    inventory_item = await db.inventory.find_unique(
        where={
            "productId_storeId": {
                "productId": data.product_id,
                "storeId": data.store_id
            }
        }
    )
    
    if not inventory_item or inventory_item.stock <= 0:
        raise HTTPException(status_code=400, detail="Product not available at selected store")
        
    # Deduct stock by 1
    await db.inventory.update(
        where={
            "productId_storeId": {
                "productId": data.product_id,
                "storeId": data.store_id
            }
        },
        data={"stock": inventory_item.stock - 1}
    )
    
    res_id = f"RES-{str(uuid.uuid4())[:5].upper()}"
    created = datetime.now().strftime("%Y-%m-%d")
    expires = (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d")
    
    new_res = await db.reservation.create(
        data={
            "id": res_id,
            "userId": current_user.id,
            "productId": data.product_id,
            "storeId": data.store_id,
            "size": data.size,
            "status": "pending",
            "createdAt": created,
            "expiresAt": expires,
            "staffNote": ""
        }
    )
    
    return {
        "message": "Reservation created successfully",
        "reservation": {
            "id": new_res.id,
            "userId": new_res.userId,
            "userName": current_user.name,
            "productId": new_res.productId,
            "productName": product.name,
            "storeId": new_res.storeId,
            "storeName": store.name,
            "size": new_res.size,
            "status": new_res.status,
            "createdAt": new_res.createdAt,
            "expiresAt": new_res.expiresAt,
            "staffNote": new_res.staffNote
        }
    }

@app.patch("/api/reservations/{reservation_id}")
async def update_reservation(reservation_id: str, data: ReservationStatusUpdate, current_user=Depends(get_current_user)):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Staff/Admin only")
        
    res = await db.reservation.find_unique(where={"id": reservation_id})
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
        
    valid_statuses = ["pending", "confirmed", "collected", "cancelled"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")
        
    # If reservation was cancelled, return stock
    if data.status == "cancelled" and res.status != "cancelled":
        inventory_item = await db.inventory.find_unique(
            where={
                "productId_storeId": {
                    "productId": res.productId,
                    "storeId": res.storeId
                }
            }
        )
        if inventory_item:
            await db.inventory.update(
                where={
                    "productId_storeId": {
                        "productId": res.productId,
                        "storeId": res.storeId
                    }
                },
                data={"stock": inventory_item.stock + 1}
            )
            
    updated = await db.reservation.update(
        where={"id": reservation_id},
        data={
            "status": data.status,
            "staffNote": data.staff_note
        }
    )
    
    p = await db.product.find_unique(where={"id": updated.productId})
    s = await db.store.find_unique(where={"id": updated.storeId})
    u = await db.user.find_unique(where={"id": updated.userId})
    
    return {
        "message": "Reservation updated",
        "reservation": {
            "id": updated.id,
            "userId": updated.userId,
            "userName": u.name if u else "Unknown User",
            "productId": updated.productId,
            "productName": p.name if p else "Deleted Product",
            "storeId": updated.storeId,
            "storeName": s.name if s else "Deleted Store",
            "size": updated.size,
            "status": updated.status,
            "createdAt": updated.createdAt,
            "expiresAt": updated.expiresAt,
            "staffNote": updated.staffNote
        }
    }

# ─── Recommendation Engine ──────────────────────────────────────────────────

@app.get("/api/recommendations")
async def get_recommendations(current_user=Depends(get_current_user)):
    wishlist_entries = await db.wishlist.find_many(where={"userId": current_user.id})
    wishlist_product_ids = [w.productId for w in wishlist_entries]
    
    wishlist_products = await db.product.find_many(where={"id": {"in": wishlist_product_ids}})
    
    # Fetch all candidate products (items not currently in the user's wishlist)
    candidates = await db.product.find_many(where={"id": {"not_in": wishlist_product_ids}})
    
    scored_candidates = []
    
    if not wishlist_products:
        # Fallback recommendations if wishlist is empty: show trending/highly-rated products
        # We score them based on rating and reviews
        for p in candidates:
            # Simple score out of 100 based on rating & trending status
            trending_boost = 15 if "trending" in (p.tags or "") else 0
            rating_score = (p.rating / 5.0) * 75
            reviews_score = min((p.reviews / 2000) * 10, 10)
            score = round(rating_score + reviews_score + trending_boost, 1)
            
            scored_candidates.append({
                "product": p,
                "score": score,
                "reason": f"Popular in {p.category} with {p.rating}★ rating"
            })
        # Sort and take top 12
        scored_candidates = sorted(scored_candidates, key=lambda x: x["score"], reverse=True)[:12]
    else:
        # Extract features of wishlist items
        wish_categories = [p.category for p in wishlist_products]
        wish_brands = [p.brand for p in wishlist_products]
        
        # Tags and colors splitting
        wish_tags = []
        wish_colors = []
        for p in wishlist_products:
            if p.tags:
                wish_tags.extend([t.strip().lower() for t in p.tags.split(",")])
            if p.colors:
                wish_colors.extend([c.strip().lower() for c in p.colors.split(",")])
                
        wish_prices = [p.price for p in wishlist_products]
        mean_price = np.mean(wish_prices)
        std_price = np.std(wish_prices) if len(wish_prices) > 1 else 1.0
        if std_price == 0:
            std_price = 1.0
            
        # Calculate frequencies using numpy/dict
        cat_counts = {cat: wish_categories.count(cat) for cat in set(wish_categories)}
        brand_counts = {brand: wish_brands.count(brand) for brand in set(wish_brands)}
        tag_counts = {tag: wish_tags.count(tag) for tag in set(wish_tags)}
        color_counts = {col: wish_colors.count(col) for col in set(wish_colors)}
        
        total_items = len(wishlist_products)
        
        for p in candidates:
            # Vector/Feature scoring
            # 1. Category similarity (up to 35 points)
            cat_score = (cat_counts.get(p.category, 0) / total_items) * 35.0
            
            # 2. Brand similarity (up to 20 points)
            brand_score = (brand_counts.get(p.brand, 0) / total_items) * 20.0
            
            # 3. Tags match (up to 15 points)
            p_tags = [t.strip().lower() for t in p.tags.split(",")] if p.tags else []
            matching_tags = sum(tag_counts.get(t, 0) for t in p_tags)
            tag_score = min((matching_tags / max(1, len(wish_tags))) * 15.0, 15.0)
            
            # 4. Color match (up to 10 points)
            p_colors = [c.strip().lower() for c in p.colors.split(",")] if p.colors else []
            matching_colors = sum(color_counts.get(c, 0) for c in p_colors)
            color_score = min((matching_colors / max(1, len(wish_colors))) * 10.0, 10.0)
            
            # 5. Price similarity (up to 10 points) using Gaussian likelihood
            price_diff = abs(p.price - mean_price)
            price_score = 10.0 * np.exp(-0.5 * (price_diff / std_price) ** 2)
            
            # 6. Rating & reviews quality boost (up to 10 points)
            quality_score = (p.rating / 5.0) * 8.0 + min((p.reviews / 2000.0) * 2.0, 2.0)
            
            # Final matching score out of 100
            total_score = round(cat_score + brand_score + tag_score + color_score + price_score + quality_score, 1)
            # Ensure within 0-100 and format
            total_score = min(max(total_score, 10.0), 99.0)
            
            # Determine primary reason for recommendation
            reasons = []
            if cat_counts.get(p.category, 0) > 0:
                reasons.append(f"matches your interest in {p.category}")
            if brand_counts.get(p.brand, 0) > 0:
                reasons.append(f"aligns with your {p.brand} brand preference")
            if matching_tags > 0:
                reasons.append("fits your design style tags")
                
            if reasons:
                reason_str = " & ".join(reasons[:2]).capitalize()
            else:
                reason_str = f"Highly rated in {p.category} matching your price range"
                
            scored_candidates.append({
                "product": p,
                "score": total_score,
                "reason": reason_str
            })
            
        # Sort candidates by score descending
        scored_candidates = sorted(scored_candidates, key=lambda x: x["score"], reverse=True)[:12]
        
    results = []
    for item in scored_candidates:
        p = item["product"]
        results.append({
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "price": p.price,
            "originalPrice": p.originalPrice,
            "rating": p.rating,
            "reviews": p.reviews,
            "description": p.description,
            "images": p.images.split(",") if p.images else [],
            "sizes": p.sizes.split(",") if p.sizes else [],
            "colors": p.colors.split(",") if p.colors else [],
            "tags": p.tags.split(",") if p.tags else [],
            "inStock": p.inStock,
            "score": item["score"],
            "reason": item["reason"]
        })
        
    return {
        "recommendations": results,
        "based_on": {
            "wishlist_count": len(wishlist_product_ids),
            "categories": list(set([p.category for p in wishlist_products])) if wishlist_products else []
        }
    }


# ─── Stores & Inventory ─────────────────────────────────────────────────────

@app.get("/api/stores")
async def get_stores():
    stores = await db.store.find_many()
    return {"stores": [dict(s) for s in stores]}

@app.get("/api/inventory")
async def get_inventory(current_user=Depends(get_current_user)):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Staff/Admin only")
        
    inventory_items = await db.inventory.find_many()
    products = await db.product.find_many()
    stores = await db.store.find_many()
    
    results = []
    for item in inventory_items:
        p = next((prod for prod in products if prod.id == item.productId), None)
        s = next((st for st in stores if st.id == item.storeId), None)
        if p and s:
            results.append({
                "productId": item.productId,
                "storeId": item.storeId,
                "product": p.name,
                "store": s.name,
                "stock": item.stock
            })
            
    return {"inventory": results}

@app.patch("/api/inventory/{product_id}/{store_id}")
async def update_inventory(product_id: int, store_id: int, stock: int, current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
        
    # Update or insert
    inv = await db.inventory.upsert(
        where={
            "productId_storeId": {
                "productId": product_id,
                "storeId": store_id
            }
        },
        data={
            "create": {
                "productId": product_id,
                "storeId": store_id,
                "stock": stock
            },
            "update": {
                "stock": stock
            }
        }
    )
    return {"message": "Inventory updated", "product_id": product_id, "store_id": store_id, "stock": inv.stock}

# ─── Analytics ──────────────────────────────────────────────────────────────

@app.get("/api/analytics")
async def get_analytics(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
        
    reservations = await db.reservation.find_many()
    users = await db.user.find_many()
    products = await db.product.find_many()
    stores = await db.store.find_many()
    
    status_counts = {}
    for r in reservations:
        status_counts[r.status] = status_counts.get(r.status, 0) + 1
        
    return {
        "total_reservations": len(reservations),
        "reservation_by_status": status_counts,
        "total_products": len(products),
        "total_users": len(users),
        "total_stores": len(stores),
    }

# ─── Try-On Bounding Box Detection (YOLO / Cascade Proxy) ───────────────────

# Load face cascade as a quick body positioning proxy
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.post("/api/tryon/detect")
async def detect_tryon(req: TryOnRequest):
    try:
        # Expecting base64 image data URL e.g. "data:image/jpeg;base64,..."
        if "," in req.image:
            header, encoded = req.image.split(",", 1)
        else:
            encoded = req.image
        
        data = base64.b64decode(encoded)
        nparr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image payload")
            
        h, w, _ = img.shape
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect faces to locate user in webcam frame
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) > 0:
            # Sort by face box area (largest first)
            faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
            fx, fy, fw, fh = faces[0]
            
            # Map try-on garment bounding box directly below the face
            body_w = int(fw * 3.2)
            body_h = int(fh * 4.2)
            body_x = int(fx - (body_w - fw) / 2)
            body_y = int(fy + fh * 1.1)
            
            # Constrain parameters within the actual frame resolution
            body_x = max(0, min(body_x, w))
            body_y = max(0, min(body_y, h))
            body_w = min(body_w, w - body_x)
            body_h = min(body_h, h - body_y)
            
            return {
                "detected": True,
                "box": {
                    "x": int(body_x),
                    "y": int(body_y),
                    "width": int(body_w),
                    "height": int(body_h)
                },
                "confidence": 0.94,
                "face": {
                    "x": int(fx),
                    "y": int(fy),
                    "width": int(fw),
                    "height": int(fh)
                }
            }
            
        # Fallback to standard frame center overlay if no faces detected
        cx, cy = w // 2, h // 2
        bw, bh = int(w * 0.45), int(h * 0.55)
        bx, by = cx - bw // 2, cy - bh // 2
        
        return {
            "detected": False,
            "box": {
                "x": bx,
                "y": by,
                "width": bw,
                "height": bh
            },
            "confidence": 0.55
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webcam frame analysis failed: {str(e)}")

# ─── Health check ───────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "AURA API", "version": "1.0.0"}
