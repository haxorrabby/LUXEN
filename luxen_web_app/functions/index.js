const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const db = admin.firestore();

// ============================================
// 1. Production Functions
// ============================================

// Placeholder for Google Drive API integration (requires OAuth setup)
// This function would handle uploading a generated report to Google Drive
app.post('/api/drive/upload', async (req, res) => {
  try {
    const { fileName, fileContent } = req.body;

    // In a real application, you would use the googleapis library here
    // after setting up OAuth2 credentials and getting an access token.
    // This is a placeholder for the server-side logic.
    
    // Example:
    // const drive = google.drive({ version: 'v3', auth: oauth2Client });
    // const fileMetadata = {
    //   'name': fileName,
    //   'parents': ['LUXEN_BUSINESS_DATA_FOLDER_ID']
    // };
    // const media = {
    //   mimeType: 'application/pdf',
    //   body: fileContent // assuming fileContent is a stream or buffer
    // };
    // const file = await drive.files.create({
    //   resource: fileMetadata,
    //   media: media,
    //   fields: 'id'
    // });

    functions.logger.info(`Drive upload placeholder executed for: ${fileName}`);

    res.json({
      success: true,
      message: 'Drive upload function executed (Placeholder - Requires OAuth setup)',
      fileName,
    });
  } catch (error) {
    functions.logger.error('Error in drive/upload:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 2. Reporting Functions
// ============================================

// Calculate and return the owner profit shares
app.get('/api/reports/owner-shares', async (req, res) => {
  try {
    const [ownersSnapshot, salesSnapshot, productionSnapshot, expensesSnapshot] = await Promise.all([
      db.collection('owners').get(),
      db.collection('sales').get(),
      db.collection('production').get(),
      db.collection('expenses').get(),
    ]);

    const owners = ownersSnapshot.docs.map(doc => doc.data());
    let totalInvestment = owners.reduce((sum, o) => sum + (o.investmentAmount || 0), 0);

    let totalSales = salesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalAmount || 0), 0);
    let totalProduction = productionSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalCost || 0), 0);
    let totalExpenses = expensesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

    const profitLoss = totalSales - totalProduction - totalExpenses;

    const shares = owners.map(owner => {
      const percentage = totalInvestment > 0 ? (owner.investmentAmount / totalInvestment) * 100 : 0;
      const profitShare = (profitLoss * percentage) / 100;
      return {
        name: owner.name,
        investmentAmount: owner.investmentAmount,
        ownershipPercentage: percentage.toFixed(2),
        profitShare: profitShare.toFixed(2),
      };
    });

    res.json({
      success: true,
      shares,
      totalInvestment,
      totalProfitLoss: profitLoss,
    });
  } catch (error) {
    functions.logger.error('Error calculating owner shares:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 3. Expense Prediction (Simple Linear Model)
// ============================================

app.get('/api/expenses/predict', async (req, res) => {
  try {
    // Get all expenses
    const expensesSnapshot = await db.collection('expenses').orderBy('createdAt', 'asc').get();
    
    // Group expenses by month and calculate total
    const monthlyTotals = {};
    expensesSnapshot.forEach(doc => {
      const data = doc.data();
      // Firestore Timestamps need conversion
      const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + data.amount;
    });

    const sortedMonths = Object.keys(monthlyTotals).sort();
    const values = sortedMonths.map(m => monthlyTotals[m]);
    const n = values.length;

    let prediction = 0;
    if (n >= 2) {
      // Simple linear regression (x = month index, y = total expense)
      const sumX = (n * (n + 1)) / 2;
      const sumY = values.reduce((a, b) => a + b, 0);
      const sumXY = values.reduce((sum, y, i) => sum + (i + 1) * y, 0);
      const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      // Predict for the next month (n + 1)
      prediction = intercept + slope * (n + 1);
    } else if (n === 1) {
        // If only one month of data, use that value as prediction
        prediction = values[0];
    }

    res.json({
      success: true,
      historicalData: monthlyTotals,
      predictedNextMonth: Math.max(0, prediction),
      confidence: n >= 3 ? 'High' : (n === 2 ? 'Medium' : 'Low'),
    });
  } catch (error) {
    functions.logger.error('Error predicting expenses:', error);
    res.status(500).json({ error: error.message });
  }
});


// ============================================
// Export the Express App as a single Cloud Function
// ============================================

exports.api = functions.https.onRequest(app);

