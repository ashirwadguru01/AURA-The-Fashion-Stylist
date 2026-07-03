import asyncio
import urllib.request
import json
import random
from prisma import Prisma

# Flagship stores to distribute inventory
STORES = [1, 2, 3, 4, 5]

BRANDS = [
    "Nike", "Adidas", "Puma", "Under Armour", "Reebok", "New Balance", "Jordan",
    "Zara", "Gucci", "Louis Vuitton", "Prada", "Balenciaga", "Armani", "Versace",
    "Ralph Lauren", "Tommy Hilfiger", "Calvin Klein", "Levi's", "H&M", "AURA Luxury"
]

COLORS = [
    "Midnight Black", "Alabaster White", "Royal Blue", "Crimson Red", "Forest Green",
    "Sage", "Slate Grey", "Camel", "Burgundy", "Navy", "Olive", "Mustard Gold"
]

SIZES_CLOTHES = ["XS", "S", "M", "L", "XL", "XXL"]
SIZES_SHOES = ["6", "7", "8", "8.5", "9", "9.5", "10", "11", "12"]

CATEGORIES = ["Footwear", "Men", "Women", "Kids", "Accessories", "Lifestyle", "Running"]

# Predefined high-quality image categories to map products to
IMAGE_POOLS = {
    "Footwear": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700&q=80",
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=700&q=80",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=700&q=80",
        "https://images.unsplash.com/photo-1556906781-9a412961d28f?w=700&q=80",
        "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=700&q=80",
        "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=700&q=80"
    ],
    "Apparel": [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&q=80",
        "https://images.unsplash.com/photo-1584545284372-f22510eb7c26?w=700&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=700&q=80",
        "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=700&q=80",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&q=80",
        "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=700&q=80"
    ],
    "Accessories": [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80",
        "https://images.unsplash.com/photo-1588444839799-eb6cd7798119?w=700&q=80",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=700&q=80"
    ]
}

def fetch_fakestore():
    try:
        url = "https://fakestoreapi.com/products"
        with urllib.request.urlopen(url, timeout=10) as req:
            return json.loads(req.read().decode())
    except Exception as e:
        print(f"Warning: FakeStore API call failed ({e}). Using synthetic generator.")
        return []

def fetch_dummyjson():
    try:
        url = "https://dummyjson.com/products?limit=100"
        with urllib.request.urlopen(url, timeout=10) as req:
            res = json.loads(req.read().decode())
            return res.get("products", [])
    except Exception as e:
        print(f"Warning: DummyJSON API call failed ({e}). Using synthetic generator.")
        return []

async def main():
    db = Prisma()
    await db.connect()

    print("Fetching base data from FakeStoreAPI & DummyJSON...")
    base_products = []
    
    # Grab base items
    fakestore_items = fetch_fakestore()
    for item in fakestore_items:
        # Filter clothing and accessories
        if "clothing" in item["category"].lower() or "jewelery" in item["category"].lower():
            base_products.append({
                "name": item["title"],
                "description": item["description"],
                "price": float(item["price"]) * 80.0, # scale to INR
                "category": "Men" if "men's" in item["category"].lower() else "Women" if "women's" in item["category"].lower() else "Accessories",
                "images": [item["image"]]
            })

    dummyjson_items = fetch_dummyjson()
    for item in dummyjson_items:
        if item["category"] in ["mens-shirts", "mens-shoes", "womens-dresses", "womens-shoes", "tops", "womens-bags", "sunglasses"]:
            base_products.append({
                "name": item["title"],
                "description": item["description"],
                "price": float(item["price"]) * 85.0, # scale to INR
                "category": "Footwear" if "shoes" in item["category"].lower() else "Accessories" if "bags" in item["category"].lower() or "sunglasses" in item["category"].lower() else "Men" if "men" in item["category"].lower() else "Women",
                "images": item["images"]
            })

    # If APIs fail or return very little, construct basic skeletons
    if len(base_products) < 20:
        base_products = [
            {"name": "Performance Running Shoes", "description": "Ergonomic mesh running shoes with responsive zoom cushion.", "price": 8500.0, "category": "Footwear", "images": [IMAGE_POOLS["Footwear"][0]]},
            {"name": "Luxury Silk Dress Shirt", "description": "Tailored fit formal shirt made of premium Egyptian cotton.", "price": 4500.0, "category": "Men", "images": [IMAGE_POOLS["Apparel"][0]]},
            {"name": "Luxe Linen Dress", "description": "Breathable summer designer dress with asymmetric hem.", "price": 9500.0, "category": "Women", "images": [IMAGE_POOLS["Apparel"][2]]},
            {"name": "Classic Leather Chronograph", "description": "Stainless steel casing water-resistant luxury timepiece.", "price": 28000.0, "category": "Accessories", "images": [IMAGE_POOLS["Accessories"][0]]}
        ]

    print(f"Acquired {len(base_products)} base products. Generating variations to reach 850+ items...")
    
    unique_products = []
    product_counter = 1
    
    # Loop and generate combinations until we exceed 850 items
    while len(unique_products) < 850:
        base = random.choice(base_products)
        brand = random.choice(BRANDS)
        color = random.choice(COLORS)
        
        # Add variation names
        name_modifiers = [
            f"{brand} {base['name']} - {color} Edition",
            f"{brand} Elite {base['name']} ({color})",
            f"Classics by {brand}: {base['name']} - {color}",
            f"{brand} Custom {color} {base['name']}",
            f"Signature {color} {base['name']} by {brand}"
        ]
        var_name = random.choice(name_modifiers)
        
        # Skip duplicates
        if any(p["name"] == var_name for p in unique_products):
            continue

        price_mod = random.uniform(0.8, 1.4)
        price = round(base["price"] * price_mod / 10) * 10 # round to nearest 10
        original_price = round(price * random.uniform(1.1, 1.35) / 10) * 10
        
        # Categorization maps
        cat = base["category"]
        if cat not in CATEGORIES:
            cat = random.choice(CATEGORIES)
            
        # Select correct sizes
        sizes = SIZES_SHOES if cat == "Footwear" else SIZES_CLOTHES
        
        # Select images
        img_type = "Footwear" if cat == "Footwear" else "Accessories" if cat == "Accessories" else "Apparel"
        imgs = base["images"] if base["images"] else [random.choice(IMAGE_POOLS[img_type])]
        # Cap image string sizes or fallback to unsplash pool
        if len(imgs) > 2:
            imgs = imgs[:2]
        
        rating = round(random.uniform(4.0, 4.9), 1)
        reviews = random.randint(15, 2400)
        
        tags_pool = ["trending", "bestseller", "new", "classic", "sale"]
        tags = random.sample(tags_pool, random.randint(1, 3))
        
        unique_products.append({
            "id": product_counter,
            "name": var_name,
            "brand": brand,
            "category": cat,
            "price": price,
            "originalPrice": original_price,
            "rating": rating,
            "reviews": reviews,
            "description": f"{base['description']} Featuring premium material construction, stylized in {color} color palette. Handcrafted by {brand}.",
            "images": ",".join(imgs),
            "sizes": ",".join(sizes),
            "colors": color,
            "tags": ",".join(tags),
            "inStock": True
        })
        product_counter += 1

    print(f"Generated {len(unique_products)} items. Committing to database...")
    
    # Batch delete old products and inventory to seed fresh large catalog
    await db.inventory.delete_many()
    await db.product.delete_many()
    
    # Insert in chunks of 50 to avoid SQLite variable limits
    chunk_size = 50
    for idx in range(0, len(unique_products), chunk_size):
        chunk = unique_products[idx:idx + chunk_size]
        # Insert products
        for p in chunk:
            await db.product.create(data=p)
            
            # Distribute inventory across stores
            for store_id in STORES:
                stock_level = random.choice([0, 0, 3, 5, 8, 12, 15, 20])
                await db.inventory.create(
                    data={
                        "productId": p["id"],
                        "storeId": store_id,
                        "stock": stock_level
                    }
                )
        print(f"Seeding Progress: {min(idx + chunk_size, len(unique_products))}/{len(unique_products)} products stored...")

    print("Success! 850+ database products seeded with dynamic inventory levels.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
