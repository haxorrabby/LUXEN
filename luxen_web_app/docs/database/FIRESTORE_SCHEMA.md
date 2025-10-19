# LUXEN Smart Business Manager - Firestore Database Schema

## Overview
This document details the Firestore database structure for the LUXEN Smart Business Manager PWA, ensuring data integrity, optimized querying, and adherence to security best practices.

## Collections and Document Structure

### 1. `owners` Collection
Stores information about business owners and their investment details. This collection is crucial for calculating ownership percentages and profit sharing.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `uid` | `string` | Firebase Authentication User ID. Document ID. |
| `email` | `string` | Owner's email address. |
| `name` | `string` | Owner's full name (e.g., "রহিম আহমেদ"). |
| `phone` | `string` | Owner's phone number. |
| `role` | `string` | User role (always "owner" for this application). |
| `investmentAmount` | `number` | Total capital invested by the owner (used for profit split). |
| `ownershipPercentage` | `number` | Calculated ownership percentage based on total investment. |
| `createdAt` | `timestamp` | Account creation date. |

### 2. `production` Collection
Records every batch of LED bulbs produced, including all associated costs and unique serial numbers.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `batchName` | `string` | Human-readable name for the batch (e.g., "Batch-2024-001"). |
| `quantity` | `number` | Number of units produced in this batch. |
| `materialCost` | `number` | Cost of raw materials. |
| `laborCost` | `number` | Labor cost for the batch. |
| `electricityCost` | `number` | Electricity and utility costs. |
| `packagingCost` | `number` | Cost of packaging and boxing. |
| `totalCost` | `number` | Sum of all costs (`material` + `labor` + `electricity` + `packaging`). |
| `costPerUnit` | `number` | Calculated cost per single unit (`totalCost` / `quantity`). |
| `serialNumbers` | `array<string>` | List of unique serial numbers (UUID/QR) generated for this batch. |
| `createdAt` | `timestamp` | Production completion date. |

### 3. `sales` Collection
Records all sales transactions, linking them to the unique serial numbers from the production batches.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `customerName` | `string` | Name of the customer or retail store. |
| `serialNumbers` | `array<string>` | List of serial numbers sold in this transaction. |
| `totalAmount` | `number` | Total revenue generated from the sale. |
| `unitPrice` | `number` | Price per unit sold (for calculation verification). |
| `paymentStatus` | `string` | Status: "Paid", "Pending", or "Partial". |
| `invoiceId` | `string` | Unique ID for the generated invoice (for tracking). |
| `createdAt` | `timestamp` | Date of the sale. |

### 4. `expenses` Collection
Tracks all non-production related factory and business expenses.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `category` | `string` | Expense type: "Transport", "Power", "Raw Materials", "Rent", "Maintenance", "Other". |
| `amount` | `number` | Expense amount in BDT (৳). |
| `description` | `string` | Detailed description of the expense (e.g., "জানুয়ারি মাসের বিদ্যুৎ বিল"). |
| `createdAt` | `timestamp` | Date the expense was incurred. |

### 5. `warranty` Collection
Manages all warranty claims and tracks the status of replacements.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `serialNumber` | `string` | The unique serial number of the claimed product. |
| `customerName` | `string` | Name of the customer making the claim. |
| `reason` | `string` | Reason for the warranty claim (e.g., "Bulb not working"). |
| `replaced` | `boolean` | `true` if a replacement was issued, `false` otherwise. |
| `createdAt` | `timestamp` | Date the claim was filed. |

### 6. `reports` Collection
Stores historical, pre-calculated monthly reports to reduce read operations on the main collections.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `month` | `number` | Month of the report (1-12). |
| `year` | `number` | Year of the report. |
| `profitLoss` | `number` | Calculated profit or loss for the period. |
| `totalSales` | `number` | Total sales for the period. |
| `totalExpenses` | `number` | Total expenses for the period. |
| `productionCost` | `number` | Total production cost for the period. |
| `ownerShares` | `map` | Profit share breakdown per owner (e.g., `{"Owner Name": 125000}`). |
| `createdAt` | `timestamp` | Date the report was generated. |

## Firestore Security Rules

The following rules ensure that only authenticated users can access the business data, and owners can only modify their own profile.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own owner document
    match /owners/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if request.auth != null;
    }
    
    // Allow authenticated users (all owners) to read/write business data
    match /{collection}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Indexes for Performance

The following composite indexes are defined to optimize the most frequent queries used for reporting and filtering:

| Index Name | Collection | Fields | Query Purpose |
| :--- | :--- | :--- | :--- |
| **Production by Date** | `production` | `createdAt` (Descending) | Latest production batches for dashboard. |
| **Sales by Date** | `sales` | `createdAt` (Descending) | Latest sales transactions. |
| **Expenses by Category & Date** | `expenses` | `category` (Ascending), `createdAt` (Descending) | Expense breakdown by type over time. |
| **Warranty by Status & Date** | `warranty` | `replaced` (Ascending), `createdAt` (Descending) | Pending vs. completed warranty claims. |
| **Reports by Year & Month** | `reports` | `year` (Descending), `month` (Descending) | Historical report retrieval. |

## Data Relationships

1.  **Owner-Centric**: All documents are implicitly linked to the authenticated owner(s) who created them.
2.  **Production to Sales**: `sales.serialNumbers` must match `production.serialNumbers`.
3.  **Sales to Warranty**: `warranty.serialNumber` must match a serial number found in `sales.serialNumbers`.
4.  **All to Reports**: All transactional collections (`production`, `sales`, `expenses`) feed into the calculated `reports` collection.

