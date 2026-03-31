const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/siis-inventory')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error(err));

const Product = require('./models/Product');
const Activity = require('./models/Activity');

const products = [
  // Electronics
  { name: 'MacBook Pro 16"', sku: 'MBP-16-2023', category: 'Electronics', price: 2499, quantity: 45, reorderLevel: 10, salesCount: 150 },
  { name: 'Dell XPS 15', sku: 'DELL-XPS-15', category: 'Electronics', price: 1899, quantity: 12, reorderLevel: 15, salesCount: 85 },
  { name: 'iPad Pro 12.9"', sku: 'IPAD-PRO-129', category: 'Electronics', price: 1099, quantity: 0, reorderLevel: 20, salesCount: 300 }, // Out of stock, high demand
  
  // Audio
  { name: 'Sony WH-1000XM5', sku: 'SONY-WH5', category: 'Audio', price: 398, quantity: 5, reorderLevel: 20, salesCount: 450 }, // Low stock, massive demand
  { name: 'AirPods Pro 2', sku: 'AIRPODS-P2', category: 'Audio', price: 249, quantity: 120, reorderLevel: 30, salesCount: 500 },
  { name: 'Bose QuietComfort 45', sku: 'BOSE-QC45', category: 'Audio', price: 329, quantity: 65, reorderLevel: 15, salesCount: 120 },
  
  // Displays
  { name: 'LG 34" Ultrawide Monitor', sku: 'LG-34-UW', category: 'Displays', price: 499, quantity: 8, reorderLevel: 10, salesCount: 45 },
  { name: 'Samsung Odyssey G7', sku: 'SAM-OD-G7', category: 'Displays', price: 699, quantity: 22, reorderLevel: 8, salesCount: 30 },
  { name: 'Dell UltraSharp 27"', sku: 'DELL-U27', category: 'Displays', price: 549, quantity: 40, reorderLevel: 12, salesCount: 110 },
  
  // Accessories
  { name: 'Logitech MX Master 3S', sku: 'LOGI-MX3S', category: 'Accessories', price: 99, quantity: 210, reorderLevel: 40, salesCount: 600 },
  { name: 'Keychron Q1 Pro Keyboard', sku: 'KEY-Q1-PRO', category: 'Accessories', price: 199, quantity: 15, reorderLevel: 25, salesCount: 220 }, // Low stock
  { name: 'Anker 737 Power Bank', sku: 'ANK-737-PB', category: 'Accessories', price: 149, quantity: 0, reorderLevel: 30, salesCount: 190 }, // Out of stock
  
  // Office Furniture
  { name: 'Ergonomic Office Chair X1', sku: 'ERGO-CHAIR-X1', category: 'Furniture', price: 349, quantity: 4, reorderLevel: 10, salesCount: 65 }, // Low stock
  { name: 'Standing Desk V2', sku: 'STAND-DESK-V2', category: 'Furniture', price: 499, quantity: 18, reorderLevel: 5, salesCount: 40 },
  { name: 'Under-Desk Cable Management', sku: 'CABLE-MGMT-01', category: 'Accessories', price: 29, quantity: 340, reorderLevel: 100, salesCount: 800 }
];

const seedDB = async () => {
  try {
    await Product.deleteMany();
    await Activity.deleteMany();

    // Insert products but with slightly varied creation dates to affect demand calculation
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      // Distribute creation dates between 10 and 60 days ago
      const daysAgo = Math.floor(Math.random() * 50) + 10; 
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      const newProduct = new Product({
        ...p,
        createdAt
      });
      await newProduct.save();
    }

    console.log('15 Diverse Products Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
