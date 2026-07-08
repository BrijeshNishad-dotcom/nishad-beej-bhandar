const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env if present
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
let prisma;

if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  let dbPath = databaseUrl;
  if (dbPath.startsWith('file:')) {
    dbPath = dbPath.slice(5);
  }
  const resolvedPath = path.resolve(process.cwd(), dbPath);
  const adapter = new PrismaBetterSqlite3({ url: 'file:' + resolvedPath });
  prisma = new PrismaClient({ adapter });
}

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear existing data
  console.log("Cleaning database...");
  await prisma.seed.deleteMany({});
  await prisma.fertilizer.deleteMany({});
  await prisma.pesticide.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.enquiry.deleteMany({});

  // 2. Create Categories
  console.log("Creating categories...");
  const categories = [
    { name: "Paddy Seeds", slug: "paddy-seeds", icon: "🌾" },
    { name: "Wheat Seeds", slug: "wheat-seeds", icon: "🌾" },
    { name: "Maize Seeds", slug: "maize-seeds", icon: "🌽" },
    { name: "Vegetable Seeds", slug: "vegetable-seeds", icon: "🥬" },
    { name: "Pulse Seeds", slug: "pulse-seeds", icon: "🌱" },
    { name: "Mustard Seeds", slug: "mustard-seeds", icon: "🌻" },
    { name: "Onion Seeds", slug: "onion-seeds", icon: "🧅" },
    { name: "Tomato Seeds", slug: "tomato-seeds", icon: "🍅" },
    { name: "Cucumber Seeds", slug: "cucumber-seeds", icon: "🥒" },
    { name: "Carrot Seeds", slug: "carrot-seeds", icon: "🥕" },
    { name: "Millet Seeds", slug: "millet-seeds", icon: "🌾" },
    { name: "Fodder Seeds", slug: "fodder-seeds", icon: "🌿" },
    { name: "Fertilizers", slug: "fertilizers", icon: "💧" },
    { name: "Pesticides", slug: "pesticides", icon: "🐛" },
    { name: "Plant Growth Promoters", slug: "plant-growth-promoters", icon: "🪴" },
  ];

  const dbCategories = {};
  for (const cat of categories) {
    const created = await prisma.category.create({
      data: cat
    });
    dbCategories[cat.slug] = created;
  }

  // 3. Create Website Settings
  console.log("Creating settings...");
  const settings = [
    { key: "shopName", value: "Nishad Beej Bhandar (निषाद बीज भंडार)" },
    { key: "ownerName", value: "Abhay Nishad (B.Sc Ag)" },
    { key: "mobileNumber", value: "6387634500" },
    { key: "whatsappNumber", value: "6387634500" },
    { key: "address", value: "Main Market Road, Near Agriculture Office, Uttar Pradesh, India" },
    { key: "businessHours", value: "Monday - Sunday: 8:00 AM - 8:00 PM" },
    { key: "aboutText", value: "We provide premium quality seeds, highly effective fertilizers, and original pesticides to help Indian farmers maximize their yield. Led by Abhay Nishad, a B.Sc Agriculture graduate, we offer expert scientific guidance and genuine brand-name products." },
    { key: "heroTitle", value: "अच्छे बीज, अच्छी फसल की शुरुआत" },
    { key: "heroSubtitle", value: "धान, गेहूं, मक्का, सरसों, सब्जियों के बीज, उर्वरक खाद एवं कीटनाशक दवाइयाँ उचित मूल्य पर उपलब्ध हैं।" }
  ];

  for (const setting of settings) {
    await prisma.setting.create({
      data: setting
    });
  }

  // 4. Create Banners
  console.log("Creating banners...");
  const banners = [
    {
      title: "उत्कृष्ट पैदावार वाले धान के बीज",
      subtitle: "Bayer Arize, Pioneer और Shriram के मूल बीज उचित दामों पर",
      imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80",
      link: "/products?category=paddy-seeds",
      order: 1
    },
    {
      title: "फसल सुरक्षा के लिए असली कीटनाशक",
      subtitle: "Coragen, Syngenta, Bayer के मूल कीटनाशक एवं कवकनाशी दवाएं",
      imageUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80",
      link: "/products?category=pesticides",
      order: 2
    }
  ];

  for (const banner of banners) {
    await prisma.banner.create({
      data: banner
    });
  }

  // 5. Create Seed Products
  console.log("Creating seeds...");
  const seeds = [
    {
      name: "Bayer Arize 6444 Gold Paddy",
      variety: "Hybrid Paddy (हाइब्रिड धान)",
      company: "Bayer CropScience",
      cropType: "Kharif",
      description: "Arize 6444 Gold is the most trusted hybrid paddy seed in India. It is highly resistant to Bacterial Leaf Blight (BLB) and provides a very high number of productive tillers.",
      price: 380,
      discountPrice: 340,
      stock: 120,
      imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80",
      status: "ACTIVE",
      germination: 85,
      seedRate: "6 kg / acre",
      maturityDuration: "135-140 Days",
      yield: "25-30 Quintals / Acre",
      benefits: "BLB resistance, Strong crop stand, High tillering capacity, High grain recovery",
      usageInstructions: "Sow in nursery in June. Transplant seedlings after 21-25 days into well-puddled field. Maintain 2-3 cm water level.",
      dosage: "6 kg seeds per acre nursery",
      categoryId: dbCategories["paddy-seeds"].id
    },
    {
      name: "Shriram Super 252 Wheat",
      variety: "Wheat Seeds (गेहूं के उन्नत बीज)",
      company: "Shriram Bioseed",
      cropType: "Rabi",
      description: "Shriram Super 252 is known for its excellent tillering, high yield capacity, and premium grain quality. Suitable for timely sown irrigated conditions.",
      price: 1300,
      discountPrice: 1150,
      stock: 200,
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
      status: "ACTIVE",
      germination: 90,
      seedRate: "40 kg / acre",
      maturityDuration: "125-130 Days",
      yield: "24-28 Quintals / Acre",
      benefits: "Lodging resistant, bold lustrous grains, good chapati quality, high heat tolerance",
      usageInstructions: "Sow in rows 20-22 cm apart in November. Irrigate at critical growth stages like crown root initiation.",
      dosage: "40 kg bag per acre",
      categoryId: dbCategories["wheat-seeds"].id
    },
    {
      name: "Pioneer 3396 Maize",
      variety: "Hybrid Maize (हाइब्रिड मक्का)",
      company: "Pioneer Seeds",
      cropType: "Kharif",
      description: "Pioneer 3396 is a high-yielding hybrid maize seed with excellent grain weight, strong stalks, and great drought tolerance.",
      price: 450,
      discountPrice: 410,
      stock: 90,
      imageUrl: "https://images.unsplash.com/photo-1551754625-70c90487530d?auto=format&fit=crop&w=600&q=80",
      status: "ACTIVE",
      germination: 88,
      seedRate: "8 kg / acre",
      maturityDuration: "110-115 Days",
      yield: "30-35 Quintals / Acre",
      benefits: "Uniform bold grains, excellent orange-yellow color, high shelling percentage, strong lodging resistance",
      usageInstructions: "Plant seeds 2-3 cm deep with 60cm row-to-row spacing and 20cm plant-to-plant spacing in June-July.",
      dosage: "8 kg per acre",
      categoryId: dbCategories["maize-seeds"].id
    },
    {
      name: "Pioneer 45S46 Mustard",
      variety: "Hybrid Mustard (हाइब्रिड सरसों)",
      company: "Pioneer Seeds",
      cropType: "Rabi",
      description: "Premium hybrid mustard seeds with high oil content and bold grains. Exceptionally high yield potential and uniform ripening.",
      price: 680,
      discountPrice: 620,
      stock: 150,
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      status: "ACTIVE",
      germination: 87,
      seedRate: "1.5 kg / acre",
      maturityDuration: "125-130 Days",
      yield: "10-12 Quintals / Acre",
      benefits: "High oil percentage (42%+), uniform maturity, drought tolerant, bold shiny seeds",
      usageInstructions: "Sow in October-November in rows 30 cm apart at a depth of 2-3 cm with moist soil conditions.",
      dosage: "1.5 kg per acre",
      categoryId: dbCategories["mustard-seeds"].id
    },
    {
      name: "Seminis Abhilash Tomato",
      variety: "F1 Hybrid Tomato (टमाटर)",
      company: "Seminis (Bayer)",
      cropType: "Zaid",
      description: "Seminis Abhilash is a highly popular hybrid tomato variety offering firm, uniform round fruits that have excellent shelf-life, making it ideal for long-distance transport.",
      price: 550,
      discountPrice: 490,
      stock: 60,
      imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
      status: "ACTIVE",
      germination: 85,
      seedRate: "40-50 grams / acre",
      maturityDuration: "65-70 Days (after transplanting)",
      yield: "200-250 Quintals / Acre",
      benefits: "Excellent shelf-life, dark red firm fruits, tolerant to leaf curl virus, heavy yield",
      usageInstructions: "Prepare nursery beds. Transplant 25-30 days old seedlings with staking support for high fruit quality.",
      dosage: "50g seeds in nursery per acre",
      categoryId: dbCategories["tomato-seeds"].id
    }
  ];

  for (const seed of seeds) {
    await prisma.seed.create({
      data: seed
    });
  }

  // 6. Create Fertilizers
  console.log("Creating fertilizers...");
  const fertilizers = [
    {
      name: "IFFCO NPK 12:32:16",
      company: "IFFCO",
      weight: "50 kg bag",
      price: 1500,
      discountPrice: 1470,
      stock: 300,
      description: "NPK 12:32:16 is a high-grade complex chemical fertilizer containing three essential plant nutrients - Nitrogen, Phosphorus and Potassium. It promotes root development, healthy crop growth and boosts flowering/fruiting.",
      status: "ACTIVE",
      categoryId: dbCategories["fertilizers"].id
    },
    {
      name: "YaraMila Complex NPK 12:11:18",
      company: "Yara Fertilizers",
      weight: "25 kg bag",
      price: 1850,
      discountPrice: 1750,
      stock: 100,
      description: "Premium chloride-free NPK compound fertilizer with microelements. Designed for high value vegetable and fruit crops. Provides balanced plant nutrition.",
      status: "ACTIVE",
      categoryId: dbCategories["fertilizers"].id
    },
    {
      name: "IFFCO Urea (Neem Coated)",
      company: "IFFCO",
      weight: "45 kg bag",
      price: 270,
      discountPrice: 266,
      stock: 800,
      description: "Government subsidized Neem Coated Urea. Provides Nitrogen slowly for uniform crop vegetative growth and greening. Suitable for all crops.",
      status: "ACTIVE",
      categoryId: dbCategories["fertilizers"].id
    }
  ];

  for (const fert of fertilizers) {
    await prisma.fertilizer.create({
      data: fert
    });
  }

  // 7. Create Pesticides
  console.log("Creating pesticides...");
  const pesticides = [
    {
      name: "FMC Coragen (Chlorantraniliprole 18.5% SC)",
      targetDisease: "Stem Borer, Leaf Folder, Fruit Borer (तना छेदक, पत्ती लपेटक)",
      company: "FMC Corporation",
      price: 1950,
      discountPrice: 1820,
      stock: 120,
      description: "Coragen is a breakthrough insecticide that provides long-duration protection to crops from Lepidopteran pests. It works through contact and ingestion, ensuring healthy stalks and green leaves.",
      status: "ACTIVE",
      categoryId: dbCategories["pesticides"].id
    },
    {
      name: "Syngenta Amistar Top (Fungicide)",
      targetDisease: "Blast, Leaf Spot, Powdery Mildew, Sheath Blight (कवकनाशी)",
      company: "Syngenta",
      price: 1100,
      discountPrice: 990,
      stock: 80,
      description: "Amistar Top is a broad-spectrum systemic fungicide containing Azoxystrobin and Difenoconazole. It offers preventive, systemic, and curative action against a wide range of fungal diseases, keeping crops green and disease-free.",
      status: "ACTIVE",
      categoryId: dbCategories["pesticides"].id
    }
  ];

  for (const pest of pesticides) {
    await prisma.pesticide.create({
      data: pest
    });
  }

  // 8. Create Plant Growth Promoters
  console.log("Creating plant growth promoters...");
  const pgps = [
    {
      name: "Bayer Planofix (Alpha Naphthyl Acetic Acid)",
      company: "Bayer CropScience",
      weight: "100 ml",
      price: 135,
      discountPrice: 120,
      stock: 150,
      description: "Planofix is an aqueous solution containing 4.5% (w/w) Alpha Naphthyl Acetic Acid active ingredient. It is a plant growth regulator used for inducing flowering, preventing shedding of flower buds and unripe fruits in cotton, tomato, chilli, mango, and grapes.",
      status: "ACTIVE",
      categoryId: dbCategories["plant-growth-promoters"].id
    }
  ];

  for (const pgp of pgps) {
    // Note: Fertilizers model also fits Plant Growth Promoters since they have Name, Company, Weight, Price, Stock, Description, etc.
    // In schema, Plant Growth Promoters are related to Category, so we can store it in Fertilizer model linked to Plant Growth Promoter Category.
    await prisma.fertilizer.create({
      data: {
        name: pgp.name,
        company: pgp.company,
        weight: pgp.weight,
        price: pgp.price,
        discountPrice: pgp.discountPrice,
        stock: pgp.stock,
        description: pgp.description,
        status: pgp.status,
        categoryId: dbCategories["plant-growth-promoters"].id
      }
    });
  }

  // 9. Create Photo Gallery
  console.log("Creating photo gallery...");
  const gallery = [
    { title: "Happy Indian Farmers Harvesting Paddy", imageUrl: "/uploads/paddy-crop.jpg" },
    { title: "Tomato Field in Full Harvest", imageUrl: "/uploads/tomato-field.jpg" },
    { title: "Quality Fertilizers Bags Stock", imageUrl: "/uploads/fertilizer-bags.png" },
    { title: "Lush Wheat Fields in Uttar Pradesh", imageUrl: "/uploads/wheat-field.jpg" },
    { title: "Quality Seed Bags & Products", imageUrl: "/uploads/seeds-stock.jpg" },
    { title: "Nishad Beej Bhandar Shop Front", imageUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80" }
  ];

  for (const item of gallery) {
    await prisma.gallery.create({
      data: item
    });
  }

  // 10. Create Farmer Enquiries
  console.log("Creating sample farmer enquiries...");
  const enquiries = [
    {
      name: "Rajesh Kumar",
      mobile: "9876543210",
      village: "Rampur",
      cropName: "Paddy (धान)",
      message: "धान की फसल में पत्ती लपेटक रोग की रोकथाम के लिए कौन सी दवा अच्छी रहेगी और उसका मूल्य क्या है?",
      status: "PENDING"
    },
    {
      name: "Ramesh Nishad",
      mobile: "7054932105",
      village: "Kalyanpur",
      cropName: "Wheat (गेहूं)",
      message: "Shriram 252 गेहूं का बीज कब तक दुकान पर उपलब्ध होगा? मुझे 5 बोरी चाहिए।",
      status: "CONTACTED"
    }
  ];

  for (const enquiry of enquiries) {
    await prisma.enquiry.create({
      data: enquiry
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
