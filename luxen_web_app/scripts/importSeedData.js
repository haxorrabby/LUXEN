#!/usr/bin/env node

/**
 * Script to import seed data into Firestore
 * Usage: node scripts/importSeedData.js
 * 
 * Make sure to set up Firebase credentials before running this script.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
// Make sure you have set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// or provide the path to your service account key file
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json';

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`Error: Service account key not found at ${serviceAccountPath}`);
  console.error('Please set the GOOGLE_APPLICATION_CREDENTIALS environment variable or place the key file in the root directory.');
  process.exit(1);
}

const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load seed data
const seedDataPath = path.join(__dirname, '../docs/database/SEED_DATA.json');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

const importData = async () => {
  try {
    console.log('Starting seed data import...\n');

    // Import owners
    console.log('Importing owners...');
    for (const owner of seedData.owners) {
      await db.collection('owners').doc(owner.uid).set(owner);
      console.log(`  ✓ Owner: ${owner.name}`);
    }

    // Import production
    console.log('\nImporting production batches...');
    for (const batch of seedData.production) {
      await db.collection('production').doc(batch.id).set(batch);
      console.log(`  ✓ Batch: ${batch.batchName}`);
    }

    // Import sales
    console.log('\nImporting sales...');
    for (const sale of seedData.sales) {
      await db.collection('sales').doc(sale.id).set(sale);
      console.log(`  ✓ Sale: ${sale.customerName} - ৳${sale.totalAmount}`);
    }

    // Import expenses
    console.log('\nImporting expenses...');
    for (const expense of seedData.expenses) {
      await db.collection('expenses').doc(expense.id).set(expense);
      console.log(`  ✓ Expense: ${expense.category} - ৳${expense.amount}`);
    }

    // Import warranty
    console.log('\nImporting warranty claims...');
    for (const warranty of seedData.warranty) {
      await db.collection('warranty').doc(warranty.id).set(warranty);
      console.log(`  ✓ Warranty: ${warranty.serialNumber}`);
    }

    // Import reports
    console.log('\nImporting reports...');
    for (const report of seedData.reports) {
      await db.collection('reports').doc(report.id).set(report);
      console.log(`  ✓ Report: ${report.month}/${report.year}`);
    }

    console.log('\n✅ Seed data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing seed data:', error);
    process.exit(1);
  }
};

importData();

