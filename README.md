<div align="center">
  <h1>🛒 Procurement Hub</h1>
  <p>Full-stack procurement management system inspired by SAP MM module</p>

  ![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
  ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
</div>

## ✨ Features
- 📋 **Purchase Order Management** — Full CRUD with DRAFT → PENDING → APPROVED/REJECTED workflow
- 🏢 **Vendor Registry** — Manage suppliers with CNPJ, category, rating, and performance history
- ✅ **Approval Workflow** — One-click approve/reject with audit trail
- 📊 **Dashboard Analytics** — Spend KPIs, recent orders, vendor metrics
- 🔍 **Status Filtering** — Filter purchase orders by workflow stage
- 💰 **BRL Currency** — Full Brazilian Real formatting throughout
- 🗄️ **Prisma + SQLite** — Zero-config setup, easily swap to PostgreSQL for production

## 🛠️ Tech Stack
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Full-stack framework |
| TypeScript | Type safety |
| Prisma ORM | Database access |
| SQLite | Embedded database |
| Tailwind CSS | Styling |

## 🚀 Getting Started
```bash
git clone https://github.com/TargaryenAG/procurement-hub.git
cd procurement-hub
npm install
npx prisma db push
npm run db:seed
npm run dev
```

## 🔄 API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List orders (filter by ?status=) |
| POST | `/api/orders` | Create purchase order |
| PUT | `/api/orders/:id` | Update order |
| POST | `/api/orders/:id/approve` | Approve order |
| POST | `/api/orders/:id/reject` | Reject order |
| GET | `/api/vendors` | List vendors |

## 📄 License
MIT © Nathan Andrade
