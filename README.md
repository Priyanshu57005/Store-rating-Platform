# RatingHub — Full-Stack Store Rating Platform

A production-quality full-stack web application designed for store rating, user administration, and owner analytics built according to the exact specification requirements.

![Tech Stack](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)
![Express](https://img.shields.io/badge/Express-4-black?style=flat-square&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5-darkgreen?style=flat-square&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-blue?style=flat-square&logo=tailwindcss)

---

## 🌟 Key Features & Role Breakdown

### 1. 🛡️ System Administrator (`ADMIN`)
- **Interactive Dashboard**: Displays overall stats (Total Users, Total Stores, Total Ratings) and rating breakdown charts.
- **Add Users & Stores**: Modal forms for registering new normal users, admins, or store owners, and registering stores with assigned owners.
- **Users Directory**: View list of all normal, store owner, and admin users with sorting (Name, Email, Address, Role) and filtering (by Name, Email, Address, Role).
- **User Detail View Modal**: Inspect full profile details for any user. **If the user is a Store Owner, their overall store rating and store list are automatically displayed.**
- **Stores Directory**: View list of all registered stores with Name, Email, Address, Overall Rating, and Owner info with sorting and search.

### 2. 👤 Normal User (`USER`)
- **Registration & Authentication**: Sign up via dedicated registration page or sign in via unified login.
- **Store Directory & Search**: Browse all registered stores with live search filterable by **Name** and **Address**.
- **Interactive Rating System**: Submit a rating (1 to 5 stars) for any store with optional comments. Modify previously submitted ratings anytime.
- **Password Management**: Update account password anytime from the navigation header.

### 3. 🏪 Store Owner (`STORE_OWNER`)
- **Owner Dashboard**: View store average rating, total review count, and a 1 to 5 stars rating distribution chart.
- **Customer Feedback Table**: View a list of users who submitted ratings for their store (User Name, Email, Submitted Rating, Comment, and Date) with dynamic column sorting, searching, and pagination.
- **Password Management**: Update account password after logging in.

---

## 📋 Strict Form Validations Enforced

All forms implement server-side (Zod) and client-side validations as specified:

| Field | Validation Rules |
| :--- | :--- |
| **Name** | Minimum **20 characters**, Maximum **60 characters**. |
| **Address** | Maximum **400 characters**. |
| **Password** | **8 to 16 characters**, must include at least **1 uppercase letter** (`A-Z`) and at least **1 special character** (`!@#$%^&*...`). |
| **Email** | Standard email validation format. |

---

## 🔐 Pre-Populated Test Credentials

The database seed populates ready-to-test accounts for all roles:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@storerating.com` | `Admin@1234Password` | System Administrator Master Account |
| **Store Owner 1** | `owner.marcus@techemporium.com` | `Owner@1234Password` | Owner of *Nexus Electronics & Gadgets Hub* |
| **Store Owner 2** | `owner.elena@artisanbakery.com` | `Owner@1234Password` | Owner of *Artisan Gourmet & Fresh Bakery* |
| **Normal User 1** | `christopher.davis@example.com` | `User@1234Password` | Christopher Alexander Davis Junior |
| **Normal User 2** | `sophia.miller@example.com` | `User@1234Password` | Sophia Catherine Miller Williams |

---

## 📁 Repository Structure

```
Roxiler Assignment/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma DB models (User, Store, Rating)
│   │   └── seed.ts             # Database seeder with sample data
│   ├── src/
│   │   ├── config/             # Database connection setup
│   │   ├── controllers/        # Auth, User, Store, Rating, Dashboard controllers
│   │   ├── middleware/         # JWT auth, Zod validation, global error handler
│   │   ├── routes/             # Express API routes
│   │   ├── schemas/            # Zod validation schemas matching specification
│   │   └── server.ts           # Express server entrypoint
│   ├── package.json
│   └── .env                    # MySQL credentials & JWT Secret
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin Dashboard, Add User/Store Modals, User Details
│   │   │   ├── auth/           # Login & Register views
│   │   │   ├── layout/         # Navbar, Password Update Modal
│   │   │   ├── store-owner/    # Store Owner Dashboard & Reviewer tables
│   │   │   ├── ui/             # StarRating, StatCard, Modal components
│   │   │   └── user/           # Store Catalog & Rate Store Modal
│   │   ├── context/            # AuthContext for session management
│   │   ├── services/           # Axios client with JWT interceptor
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css           # Linear/Vercel dark theme styles & animations
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── package.json                # Monorepo root orchestration scripts
└── README.md
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL Server (running on port 3306)

### 1. Database & Backend Configuration
Make sure MySQL service is running. The default `.env` is preconfigured for:
`DATABASE_URL="mysql://root:Priyanshu%40950@localhost:3306/store_rating_db"`

Execute database migration and seed:
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Push schema to MySQL database
npx prisma db push

# Seed initial admin, store owners, users, stores and ratings
npx prisma db seed

# Start backend dev server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup
In a separate terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start Vite dev server (runs on http://localhost:3000)
npm run dev
```

Open your browser at `http://localhost:3000` to test the application!
