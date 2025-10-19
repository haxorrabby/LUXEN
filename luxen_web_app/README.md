# LUXEN Smart Business Manager

**A complete, free, web-based business management system for LED bulb manufacturers.**

![LUXEN](https://img.shields.io/badge/LUXEN-Smart%20Business%20Manager-6200EE?style=flat-square)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Latest-FFCA28?style=flat-square&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🎯 Overview

LUXEN Smart Business Manager is a **Progressive Web App (PWA)** designed specifically for LED bulb manufacturing businesses. It provides a complete, integrated solution for managing production, sales, expenses, warranty claims, and owner investments—all for **free** using open-source technologies and Firebase's free tier.

### Key Features

✅ **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop  
✅ **Progressive Web App** - Install as a native app, works offline  
✅ **Bilingual UI** - Bangla (বাংলা) and English support throughout  
✅ **Real-time Data** - Firestore synchronization across all devices  
✅ **Production Tracking** - Auto-generate serial numbers and QR codes  
✅ **Sales Management** - Record sales, generate PDF invoices  
✅ **Expense Tracking** - Predict next month's expenses with AI  
✅ **Warranty Management** - Track claims and replacements  
✅ **Owner Investment** - Calculate profit shares automatically  
✅ **Advanced Reports** - PDF/XLSX export with charts  
✅ **Google Drive Sync** - Auto-backup to Google Drive  
✅ **AI Assistant** - LUXEN Chat answers business questions  
✅ **100% Free** - No subscription fees, uses free tiers only  

---

## 🏗️ Architecture

### Frontend
- **React.js** - Modern UI framework
- **Material-UI (MUI)** - Professional component library
- **Redux** - State management
- **Chart.js** - Data visualization
- **jsPDF & XLSX.js** - Report generation

### Backend
- **Firebase Authentication** - Secure user login
- **Firestore** - Real-time NoSQL database
- **Firebase Cloud Functions** - Serverless backend logic
- **Firebase Hosting** - Fast, secure deployment

### Services
- **Google Drive API** - Cloud backup and file sync
- **Local LLM** - In-browser AI for the LUXEN Assistant

---

## 📋 Core Modules

### 1. **Dashboard**
Real-time overview of your business with:
- Total sales, expenses, and profit/loss metrics
- Interactive charts (Line, Bar, Pie)
- Quick action buttons
- Owner profit breakdown

### 2. **Production Management**
- Create production batches with cost breakdown
- Auto-generate unique serial numbers (UUID format)
- Generate and display QR codes
- Track material, labor, electricity, and packaging costs
- Export batch reports

### 3. **Sales Management**
- Record sales with customer information
- Link sales to production serial numbers
- Auto-calculate total amount
- Track payment status (Paid, Pending, Partial)
- Generate PDF invoices
- View sales history and statistics

### 4. **Expense Tracking**
- Add expenses by category (Transport, Power, Raw Materials, Rent, Maintenance, Other)
- Predict next month's expenses using linear regression
- View category-wise breakdown
- Export to Excel (XLSX)
- Daily and monthly totals

### 5. **Warranty Management**
- Record warranty claims with serial number and reason
- Track replacement status
- Search claims by serial number
- Generate warranty reports
- View claim statistics and replacement rate

### 6. **Owner & Investment**
- Manage multiple owners
- Track investment amounts
- Auto-calculate ownership percentages
- Distribute profit based on investment
- Calculate ROI for each owner
- Visual ownership breakdown

### 7. **Reports & Analytics**
- Monthly profit/loss statements
- Owner profit share breakdown
- Interactive charts and trends
- Export to PDF and Excel
- Filter by month and year
- Historical report archive

### 8. **Google Drive Sync**
- Auto-upload reports to Google Drive
- Organized folder structure:
  - `LUXEN_BUSINESS_DATA/`
    - `Production/`
    - `Sales/`
    - `Expenses/`
    - `Warranty/`
    - `Reports/`
    - `Backups/`
- Download old reports
- Automatic backup

### 9. **LUXEN AI Assistant**
- Chat interface for business queries
- Bilingual support (Bangla + English)
- Answers questions like:
  - "গত মাসের লাভ কত?" (What was last month's profit?)
  - "Owner1 balance?" (Owner's profit share)
  - "কত লাইট warranty তে গেছে?" (How many lights went to warranty?)
- Real-time data integration
- Minimizable chat panel

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- Firebase CLI (`npm install -g firebase-tools`)
- A Google Cloud Project and Firebase Project

### Installation

1. **Clone or extract the project**
   ```bash
   cd luxen_web_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase and Google API credentials
   ```

4. **Run locally**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

### Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

Your app will be live at `https://your-project-id.web.app`

For detailed setup instructions, see [SETUP_GUIDE.md](docs/deployment/SETUP_GUIDE.md).

---

## 📊 Database Schema

The application uses Firestore with the following collections:

| Collection | Purpose | Key Fields |
| :--- | :--- | :--- |
| `owners` | User profiles and investments | uid, name, investmentAmount |
| `production` | Production batches | batchName, quantity, totalCost, serialNumbers |
| `sales` | Sales transactions | customerName, serialNumbers, totalAmount, paymentStatus |
| `expenses` | Business expenses | category, amount, description |
| `warranty` | Warranty claims | serialNumber, reason, replaced |
| `reports` | Monthly reports | month, year, profitLoss, ownerShares |

See [FIRESTORE_SCHEMA.md](docs/database/FIRESTORE_SCHEMA.md) for detailed schema documentation.

---

## 🔐 Security

- **Firebase Authentication** - Secure email/password login
- **Firestore Security Rules** - Row-level access control
- **HTTPS** - All data encrypted in transit
- **OAuth 2.0** - Secure Google Drive integration
- **No sensitive data in code** - All credentials in environment variables

---

## 📱 PWA Features

- **Install as App** - Add to home screen on mobile or desktop
- **Offline Support** - Service worker for offline functionality
- **Fast Loading** - Optimized bundle size and caching
- **Responsive Design** - Works on all screen sizes
- **App Shortcuts** - Quick access to key features

---

## 🤖 AI Assistant (LUXEN)

The LUXEN Assistant uses intelligent pattern matching to answer business questions:

**Example Queries:**
- "গত মাসের লাভ কত?" → Returns profit/loss calculation
- "Owner1 balance?" → Shows owner's profit share
- "কত লাইট warranty তে গেছে?" → Warranty statistics
- "Total sales?" → Current sales metrics
- "Expense prediction?" → Next month's expense forecast

The assistant automatically detects the language (Bangla/English) and responds accordingly.

---

## 📈 Scalability

Built on Firebase's serverless architecture:
- **Auto-scaling** - Handles traffic spikes automatically
- **Global CDN** - Fast content delivery worldwide
- **Real-time sync** - Firestore handles concurrent updates
- **Unlimited users** - Scale without infrastructure costs

---

## 💰 Cost Analysis

**Free Tier Includes:**
- Firebase Authentication: 50,000 free logins/month
- Firestore: 50,000 free reads/day, 20,000 free writes/day
- Firebase Hosting: 1 GB free storage, 10 GB free bandwidth/month
- Cloud Functions: 2 million free invocations/month
- Google Drive: 15 GB free storage

**Estimated Monthly Cost:** $0 (for most small businesses)

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 18, Material-UI, Redux, Chart.js |
| **Backend** | Firebase Cloud Functions, Node.js |
| **Database** | Firestore (NoSQL) |
| **Authentication** | Firebase Auth |
| **Hosting** | Firebase Hosting |
| **Cloud Storage** | Google Drive API |
| **Reports** | jsPDF, XLSX.js |
| **UI Framework** | Material Design 3 |
| **Language** | Bangla + English |

---

## 📚 Documentation

- [Setup Guide](docs/deployment/SETUP_GUIDE.md) - Complete setup and deployment instructions
- [Firestore Schema](docs/database/FIRESTORE_SCHEMA.md) - Database structure and relationships
- [Seed Data](docs/database/SEED_DATA.json) - Sample data for testing

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎓 Learning Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Google Drive API](https://developers.google.com/drive)

---

## 📞 Support

For issues, questions, or suggestions:
1. Check the [Troubleshooting Guide](docs/deployment/SETUP_GUIDE.md#troubleshooting)
2. Review the [Firestore Schema](docs/database/FIRESTORE_SCHEMA.md)
3. Check Firebase Console for error logs

---

## 🎉 Features Coming Soon

- [ ] SMS notifications for important events
- [ ] Advanced analytics and forecasting
- [ ] Multi-language support (more languages)
- [ ] Mobile app (React Native)
- [ ] Advanced inventory management
- [ ] Supplier management
- [ ] Customer relationship management (CRM)
- [ ] Integration with accounting software

---

## 🌟 Why LUXEN?

✨ **For LED Manufacturers:**
- Designed specifically for your industry
- Handles production batches and serial numbers
- Tracks warranty claims effectively
- Manages owner investments and profit sharing

💡 **For Small Businesses:**
- No setup costs or subscription fees
- Easy to use, no technical knowledge required
- Bilingual interface (Bangla + English)
- Works on any device with a browser

🚀 **For Growth:**
- Scalable architecture
- Real-time data synchronization
- Professional reporting and analytics
- Cloud backup and security

---

**Made with ❤️ for LUXEN LED Bulb Manufacturing**

---

## Version History

- **v1.0.0** (2024) - Initial release with all core features

---

**Last Updated:** October 2024  
**Status:** Production Ready ✅

