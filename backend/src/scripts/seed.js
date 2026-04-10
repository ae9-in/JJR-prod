import { connectDb } from '../config/db.js';
import { Product } from '../models/Product.js';
import { seedProducts } from '../data/seedProducts.js';
import { Vertical } from '../models/Vertical.js';
import { seedVerticals } from '../data/seedVerticals.js';

const run = async () => {
  try {
    await connectDb();
    await Vertical.deleteMany({});
    await Product.deleteMany({});
    await Vertical.insertMany(seedVerticals);
    await Product.insertMany(seedProducts);
    console.log(`Seeded ${seedVerticals.length} verticals and ${seedProducts.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed', error);
    process.exit(1);
  }
};

run();
