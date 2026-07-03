export const MOCK_PRODUCTS = [
  {
    id:1, name:"Nike Air Max 270", brand:"Nike", category:"Footwear", gender:"men",
    price:18500, originalPrice:22000, rating:4.8, reviews:1247,
    images:["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80","https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&q=80"],
    description:"Experience next-level comfort with the largest Air heel unit Nike has ever made. The stretchy upper wraps your foot perfectly.",
    sizes:["7","8","8.5","9","10","11","12"], colors:["Black/White","Blue/Orange","White"],
    tags:["trending","bestseller"], inStock:true,
    stores:[
      {id:1,name:"AURA Bandra",city:"Mumbai",km:1.2,stock:12},
      {id:2,name:"AURA Andheri",city:"Mumbai",km:8.5,stock:0},
      {id:3,name:"AURA Koramangala",city:"Bangalore",km:14,stock:5},
    ]
  },
  {
    id:2, name:"Adidas Ultraboost 23", brand:"Adidas", category:"Running", gender:"men",
    price:24999, originalPrice:29999, rating:4.9, reviews:892,
    images:["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700&q=80","https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=700&q=80"],
    description:"Continental™ rubber outsole + Boost midsole = the ultimate running machine. Primeknit upper adapts to your every stride.",
    sizes:["6","7","8","9","10","11"], colors:["Core Black","Cloud White","Solar Red"],
    tags:["new"], inStock:true,
    stores:[
      {id:1,name:"AURA Bandra",city:"Mumbai",km:1.2,stock:3},
      {id:3,name:"AURA Koramangala",city:"Bangalore",km:14,stock:8},
      {id:4,name:"AURA Connaught Place",city:"Delhi",km:22,stock:0},
    ]
  },
  {
    id:3, name:"New Balance 574", brand:"New Balance", category:"Lifestyle", gender:"unisex",
    price:14999, originalPrice:17500, rating:4.6, reviews:543,
    images:["https://images.unsplash.com/photo-1539185441755-769473a23570?w=700&q=80"],
    description:"The classic 574 silhouette reimagined for today. ENCAP midsole cushioning for all-day comfort.",
    sizes:["7","8","9","10","11","12"], colors:["Navy","Grey","Forest Green"],
    tags:["classic"], inStock:true,
    stores:[
      {id:2,name:"AURA Andheri",city:"Mumbai",km:8.5,stock:15},
      {id:5,name:"AURA T. Nagar",city:"Chennai",km:5.3,stock:7},
    ]
  },
  {
    id:4, name:"Air Jordan 1 Retro High OG", brand:"Nike", category:"Footwear", gender:"men",
    price:34999, originalPrice:38999, rating:4.9, reviews:2103,
    images:["https://images.unsplash.com/photo-1556906781-9a412961d28f?w=700&q=80"],
    description:"The shoe that started it all. Premium leather upper, Air-Sole cushioning, and an ankle collar that provides support and style.",
    sizes:["8","9","10","11"], colors:["Chicago","Royal Blue","Shadow"],
    tags:["trending","new","premium"], inStock:true,
    stores:[
      {id:1,name:"AURA Bandra",city:"Mumbai",km:1.2,stock:2},
      {id:5,name:"AURA T. Nagar",city:"Chennai",km:5.3,stock:1},
    ]
  },
  {
    id:5, name:"Flex Training Tee", brand:"AURA Sport", category:"Men", gender:"men",
    price:1499, originalPrice:1999, rating:4.6, reviews:98,
    images:["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&q=80","https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&q=80"],
    description:"Moisture-wicking performance tee with 4-way stretch fabric. Breathable and durable for any workout.",
    sizes:["XS","S","M","L","XL","XXL"], colors:["Black","White","Navy"],
    tags:["new","sale"], inStock:true,
    stores:[
      {id:1,name:"AURA Bandra",city:"Mumbai",km:1.2,stock:20},
      {id:2,name:"AURA Andheri",city:"Mumbai",km:8.5,stock:14},
      {id:3,name:"AURA Koramangala",city:"Bangalore",km:14,stock:18},
    ]
  },
  {
    id:6, name:"Women's Run Division Jacket", brand:"Nike", category:"Women", gender:"women",
    price:5999, originalPrice:7499, rating:4.7, reviews:312,
    images:["https://images.unsplash.com/photo-1584545284372-f22510eb7c26?w=700&q=80"],
    description:"Lightweight running jacket with reflective details. Packable design fits in its own pocket.",
    sizes:["XS","S","M","L","XL"], colors:["Pink","Black","Teal"],
    tags:["trending","sale"], inStock:true,
    stores:[
      {id:1,name:"AURA Bandra",city:"Mumbai",km:1.2,stock:8},
      {id:4,name:"AURA Connaught Place",city:"Delhi",km:22,stock:5},
    ]
  },
  {
    id:7, name:"Puma RS-X³ Puzzle", brand:"Puma", category:"Footwear", gender:"unisex",
    price:12999, originalPrice:15999, rating:4.4, reviews:328,
    images:["https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=700&q=80"],
    description:"Bold retro design with RS cushioning technology for all-day comfort. Chunky outsole inspired by the 80s.",
    sizes:["7","8","9","10","11"], colors:["White/Blue","Black/Red"],
    tags:["sale"], inStock:true,
    stores:[
      {id:1,name:"AURA Bandra",city:"Mumbai",km:1.2,stock:6},
      {id:5,name:"AURA T. Nagar",city:"Chennai",km:5.3,stock:2},
    ]
  },
  {
    id:8, name:"Converse Chuck Taylor All Star", brand:"Converse", category:"Lifestyle", gender:"unisex",
    price:7999, originalPrice:9500, rating:4.6, reviews:3521,
    images:["https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=700&q=80"],
    description:"The original basketball shoe turned cultural icon. Canvas upper with vulcanized rubber sole.",
    sizes:["6","7","8","9","10","11","12"], colors:["Black","White","Red","Navy"],
    tags:["classic","bestseller","sale"], inStock:true,
    stores:[
      {id:1,name:"AURA Bandra",city:"Mumbai",km:1.2,stock:20},
      {id:2,name:"AURA Andheri",city:"Mumbai",km:8.5,stock:18},
      {id:3,name:"AURA Koramangala",city:"Bangalore",km:14,stock:12},
      {id:4,name:"AURA Connaught Place",city:"Delhi",km:22,stock:9},
    ]
  },
  {
    id:9, name:"Oversized Hoodie", brand:"AURA Sport", category:"Men", gender:"men",
    price:2499, originalPrice:3499, rating:4.5, reviews:187,
    images:["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=700&q=80"],
    description:"Ultra-soft fleece hoodie with kangaroo pocket. Relaxed fit for the ultimate streetwear look.",
    sizes:["S","M","L","XL","XXL"], colors:["Black","Cream","Olive"],
    tags:["trending"], inStock:true,
    stores:[
      {id:3,name:"AURA Koramangala",city:"Bangalore",km:14,stock:10},
      {id:4,name:"AURA Connaught Place",city:"Delhi",km:22,stock:7},
    ]
  },
  {
    id:10, name:"Women's Yoga Leggings", brand:"AURA Sport", category:"Women", gender:"women",
    price:1999, originalPrice:2499, rating:4.8, reviews:445,
    images:["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=700&q=80"],
    description:"High-waist compression leggings with phone pockets. 4-way stretch for full range of motion.",
    sizes:["XS","S","M","L","XL"], colors:["Black","Wine","Sage"],
    tags:["bestseller","sale"], inStock:true,
    stores:[
      {id:1,name:"AURA Bandra",city:"Mumbai",km:1.2,stock:25},
      {id:5,name:"AURA T. Nagar",city:"Chennai",km:5.3,stock:15},
    ]
  },
];

export const MOCK_CATEGORIES = [
  {id:1,name:"Men",icon:"👔",count:124},
  {id:2,name:"Women",icon:"👗",count:203},
  {id:3,name:"Kids",icon:"🧒",count:45},
  {id:4,name:"Footwear",icon:"👟",count:87},
  {id:5,name:"Accessories",icon:"🕶️",count:68},
];

export const MOCK_STORES = [
  {id:1,name:"AURA Bandra",city:"Mumbai",address:"Linking Road, Bandra West, Mumbai",phone:"+91-22-2640-1234",hours:"10AM–10PM",km:1.2,staff:8},
  {id:2,name:"AURA Andheri",city:"Mumbai",address:"Infiniti Mall, New Link Road, Andheri West",phone:"+91-22-2636-5678",hours:"11AM–9PM",km:8.5,staff:6},
  {id:3,name:"AURA Koramangala",city:"Bangalore",address:"100 Feet Road, 4th Block, Koramangala",phone:"+91-80-4112-3456",hours:"10AM–10PM",km:14,staff:10},
  {id:4,name:"AURA Connaught Place",city:"Delhi",address:"Block A, Connaught Place, New Delhi",phone:"+91-11-2334-5678",hours:"10AM–9PM",km:22,staff:12},
  {id:5,name:"AURA T. Nagar",city:"Chennai",address:"Usman Road, T. Nagar, Chennai",phone:"+91-44-2431-2345",hours:"10AM–10PM",km:5.3,staff:7},
];

export const MOCK_USERS = [
  {id:1,name:"Rahul Sharma",email:"customer@aura.com",role:"customer",avatar:"RS",joinDate:"2024-01-15",totalOrders:12,wishlistCount:8},
  {id:2,name:"Priya Mehta",email:"priya@example.com",role:"customer",avatar:"PM",joinDate:"2024-03-22",totalOrders:5,wishlistCount:15},
  {id:3,name:"Arjun Singh",email:"arjun@example.com",role:"customer",avatar:"AS",joinDate:"2024-05-10",totalOrders:3,wishlistCount:4},
];

export const MOCK_RESERVATIONS = [
  {id:"RES-001",userId:1,userName:"Rahul Sharma",productId:1,productName:"Nike Air Max 270",storeId:1,storeName:"AURA Bandra",size:"10",status:"confirmed",createdAt:"2025-06-01",expiresAt:"2025-06-05",staffNote:""},
  {id:"RES-002",userId:2,userName:"Priya Mehta",productId:4,productName:"Air Jordan 1 Retro High OG",storeId:5,storeName:"AURA T. Nagar",size:"8",status:"pending",createdAt:"2025-06-02",expiresAt:"2025-06-06",staffNote:""},
  {id:"RES-003",userId:3,userName:"Arjun Singh",productId:2,productName:"Adidas Ultraboost 23",storeId:3,storeName:"AURA Koramangala",size:"9",status:"collected",createdAt:"2025-05-28",expiresAt:"2025-06-01",staffNote:"Collected on time"},
  {id:"RES-004",userId:1,userName:"Rahul Sharma",productId:8,productName:"Converse Chuck Taylor",storeId:1,storeName:"AURA Bandra",size:"11",status:"cancelled",createdAt:"2025-05-25",expiresAt:"2025-05-29",staffNote:"Customer cancelled"},
];

export const ANALYTICS_DATA = {
  dailyVisitors:[120,145,132,178,195,167,210],
  weekLabels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  topProducts:[
    {name:"Air Jordan 1 Retro High OG",sales:45,revenue:1574955},
    {name:"Nike Air Max 270",sales:78,revenue:1443000},
    {name:"Adidas Ultraboost 23",sales:52,revenue:1299948},
    {name:"Converse Chuck Taylor",sales:134,revenue:1071866},
  ],
  categoryBreakdown:[
    {name:"Footwear",percent:38},{name:"Men",percent:25},{name:"Women",percent:22},{name:"Lifestyle",percent:15},
  ],
  revenue:{thisMonth:4850000,lastMonth:3920000},
  reservations:{total:89,pending:12,confirmed:45,collected:28,cancelled:4},
};
