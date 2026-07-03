import asyncio
from prisma import Prisma
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

USERS = [
    {"name": "Rahul Sharma", "email": "customer@aura.com", "password": "demo123", "role": "customer"},
    {"name": "Staff Member", "email": "staff@aura.com", "password": "demo123", "role": "staff"},
    {"name": "Admin User", "email": "admin@aura.com", "password": "demo123", "role": "admin"},
]

STORES = [
    {"id": 1, "name": "AURA Bandra", "city": "Mumbai", "address": "Linking Road, Bandra West, Mumbai", "phone": "+91-22-2640-1234", "hours": "10AM–10PM"},
    {"id": 2, "name": "AURA Andheri", "city": "Mumbai", "address": "Infiniti Mall, New Link Road, Andheri West", "phone": "+91-22-2636-5678", "hours": "11AM–9PM"},
    {"id": 3, "name": "AURA Koramangala", "city": "Bangalore", "address": "100 Feet Road, 4th Block, Koramangala", "phone": "+91-80-4112-3456", "hours": "10AM–10PM"},
    {"id": 4, "name": "AURA Connaught Place", "city": "Delhi", "address": "Block A, Connaught Place, New Delhi", "phone": "+91-11-2334-5678", "hours": "10AM–9PM"},
    {"id": 5, "name": "AURA T. Nagar", "city": "Chennai", "address": "Usman Road, T. Nagar, Chennai", "phone": "+91-44-2431-2345", "hours": "10AM–10PM"},
]

PRODUCTS = [
    {
        "id": 1, "name": "Nike Air Max 270", "brand": "Nike", "category": "Footwear",
        "price": 18500.0, "originalPrice": 22000.0, "rating": 4.8, "reviews": 1247,
        "description": "Experience next-level comfort with the largest Air heel unit Nike has ever made.",
        "images": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80,https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&q=80",
        "sizes": "7,8,8.5,9,10,11,12", "colors": "Black/White,Blue/Orange,White",
        "tags": "trending,bestseller", "inStock": True
    },
    {
        "id": 2, "name": "Adidas Ultraboost 23", "brand": "Adidas", "category": "Running",
        "price": 24999.0, "originalPrice": 29999.0, "rating": 4.9, "reviews": 892,
        "description": "Continental™ rubber outsole + Boost midsole = the ultimate running machine.",
        "images": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700&q=80,https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=700&q=80",
        "sizes": "6,7,8,9,10,11", "colors": "Core Black,Cloud White,Solar Red",
        "tags": "new", "inStock": True
    },
    {
        "id": 3, "name": "New Balance 574", "brand": "New Balance", "category": "Lifestyle",
        "price": 14999.0, "originalPrice": 17500.0, "rating": 4.6, "reviews": 543,
        "description": "The classic 574 silhouette reimagined for today. ENCAP midsole cushioning.",
        "images": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=700&q=80",
        "sizes": "7,8,9,10,11,12", "colors": "Navy,Grey,Forest Green",
        "tags": "classic", "inStock": True
    },
    {
        "id": 4, "name": "Air Jordan 1 Retro High OG", "brand": "Nike", "category": "Footwear",
        "price": 34999.0, "originalPrice": 38999.0, "rating": 4.9, "reviews": 2103,
        "description": "The shoe that started it all. Premium leather upper, Air-Sole cushioning.",
        "images": "https://images.unsplash.com/photo-1556906781-9a412961d28f?w=700&q=80",
        "sizes": "8,9,10,11", "colors": "Chicago,Royal Blue,Shadow",
        "tags": "trending,new,premium", "inStock": True
    },
    {
        "id": 5, "name": "Flex Training Tee", "brand": "AURA Sport", "category": "Men",
        "price": 1499.0, "originalPrice": 1999.0, "rating": 4.6, "reviews": 98,
        "description": "Moisture-wicking performance tee with 4-way stretch fabric.",
        "images": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&q=80,https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&q=80",
        "sizes": "XS,S,M,L,XL,XXL", "colors": "Black,White,Navy",
        "tags": "new,sale", "inStock": True
    },
    {
        "id": 6, "name": "Women's Run Division Jacket", "brand": "Nike", "category": "Women",
        "price": 5999.0, "originalPrice": 7499.0, "rating": 4.7, "reviews": 312,
        "description": "Lightweight running jacket with reflective details. Packable design.",
        "images": "https://images.unsplash.com/photo-1584545284372-f22510eb7c26?w=700&q=80",
        "sizes": "XS,S,M,L,XL", "colors": "Pink,Black,Teal",
        "tags": "trending,sale", "inStock": True
    },
    {
        "id": 7, "name": "Puma RS-X³ Puzzle", "brand": "Puma", "category": "Footwear",
        "price": 12999.0, "originalPrice": 15999.0, "rating": 4.4, "reviews": 328,
        "description": "Bold retro design with RS cushioning technology for all-day comfort.",
        "images": "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=700&q=80",
        "sizes": "7,8,9,10,11", "colors": "White/Blue,Black/Red",
        "tags": "sale", "inStock": True
    },
    {
        "id": 8, "name": "Converse Chuck Taylor All Star", "brand": "Converse", "category": "Lifestyle",
        "price": 7999.0, "originalPrice": 9500.0, "rating": 4.6, "reviews": 3521,
        "description": "The original basketball shoe turned cultural icon. Canvas upper.",
        "images": "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=700&q=80",
        "sizes": "6,7,8,9,10,11,12", "colors": "Black,White,Red,Navy",
        "tags": "classic,bestseller,sale", "inStock": True
    },
]

INVENTORY = [
    # Nike Air Max
    {"productId": 1, "storeId": 1, "stock": 12},
    {"productId": 1, "storeId": 2, "stock": 0},
    {"productId": 1, "storeId": 3, "stock": 5},
    # Adidas
    {"productId": 2, "storeId": 1, "stock": 3},
    {"productId": 2, "storeId": 3, "stock": 8},
    {"productId": 2, "storeId": 4, "stock": 0},
    # New Balance
    {"productId": 3, "storeId": 2, "stock": 15},
    {"productId": 3, "storeId": 5, "stock": 7},
    # Jordan 1
    {"productId": 4, "storeId": 1, "stock": 2},
    {"productId": 4, "storeId": 5, "stock": 1},
    # Flex Tee
    {"productId": 5, "storeId": 1, "stock": 20},
    {"productId": 5, "storeId": 2, "stock": 14},
    {"productId": 5, "storeId": 3, "stock": 18},
    # Run Jacket
    {"productId": 6, "storeId": 1, "stock": 8},
    {"productId": 6, "storeId": 4, "stock": 5},
    # Puma
    {"productId": 7, "storeId": 1, "stock": 6},
    {"productId": 7, "storeId": 5, "stock": 2},
    # Converse
    {"productId": 8, "storeId": 1, "stock": 20},
    {"productId": 8, "storeId": 2, "stock": 18},
    {"productId": 8, "storeId": 3, "stock": 12},
    {"productId": 8, "storeId": 4, "stock": 9},
]

async def seed():
    db = Prisma()
    await db.connect()

    print("Seeding Users...")
    for u in USERS:
        hashed = pwd_context.hash(u["password"])
        # Check if already exists
        exists = await db.user.find_unique(where={"email": u["email"]})
        if not exists:
            await db.user.create(
                data={
                    "name": u["name"],
                    "email": u["email"],
                    "password": hashed,
                    "role": u["role"]
                }
            )

    print("Seeding Stores...")
    for s in STORES:
        exists = await db.store.find_unique(where={"id": s["id"]})
        if not exists:
            await db.store.create(
                data=s
            )

    print("Seeding Products...")
    for p in PRODUCTS:
        exists = await db.product.find_unique(where={"id": p["id"]})
        if not exists:
            await db.product.create(
                data=p
            )

    print("Seeding Inventory...")
    for i in INVENTORY:
        exists = await db.inventory.find_unique(
            where={
                "productId_storeId": {
                    "productId": i["productId"],
                    "storeId": i["storeId"]
                }
            }
        )
        if not exists:
            await db.inventory.create(
                data=i
            )

    print("Seeding complete!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(seed())
