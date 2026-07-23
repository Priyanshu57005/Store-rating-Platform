# RatingHub - Store Rating Platform

A full-stack web application built as part of the Roxiler Systems Full Stack Coding Challenge.

The platform allows users to rate stores, store owners to view ratings for their stores, and administrators to manage users, stores, and platform statistics.

![Tech Stack](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)
![Express](https://img.shields.io/badge/Express-4-black?style=flat-square&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5-darkgreen?style=flat-square&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-blue?style=flat-square&logo=tailwindcss)
![Backend Deployed](https://img.shields.io/badge/Backend-Deployed%20on%20Render-informational?style=flat-square&logo=render)

---

## Live Demo

**Frontend:** https://store-rating-platform-by-priyanshu.netlify.app/

**Backend API:** https://store-rating-platform-roxiler-assignment.onrender.com

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Zod Validation

### Database
- MySQL (Railway Cloud)

---

## Features

### Admin
- Login as administrator
- Dashboard showing:
  - Total Users
  - Total Stores
  - Total Ratings
- Add new users
- Add new stores
- View all users
- View all stores
- Search and sort users
- Search and sort stores
- View store owner details along with store rating

---

### Normal User
- Register account
- Login
- Browse all stores
- Search stores by name or address
- Submit ratings
- Update previously submitted ratings
- Change password

---

### Store Owner
- Login
- View average store rating
- View users who rated the store
- View rating distribution
- Change password

---

## Form Validation

The application follows the validation rules provided in the assignment.

| Field | Validation |
|---|---|
| Name | 20–60 characters |
| Address | Maximum 400 characters |
| Password | 8–16 characters, one uppercase letter and one special character |
| Email | Standard email format |

Validation is implemented on both the frontend and backend.

---

## Test Accounts

### Admin
- **Email:** `admin@storerating.com`
- **Password:** `Admin@1234Password`

---

### Store Owner
- **Email:** `owner.marcus@techemporium.com`
- **Password:** `Owner@1234Password`

---

### User
- **Email:** `christopher.davis@example.com`
- **Password:** `User@1234Password`

---

## Project Structure

```
backend/
    prisma/
    src/
        controllers/
        middleware/
        routes/
        schemas/
        config/

frontend/
    src/
        components/
        context/
        services/
        types/
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Priyanshu57005/Store-rating-Platform-Roxiler-Assignment.git
```

---

### Backend

```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install

# (Optional) Create .env file for backend API URL
# Defaults to https://store-rating-platform-roxiler-assignment.onrender.com
# VITE_API_URL=https://store-rating-platform-roxiler-assignment.onrender.com

npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL=mysql://...
JWT_SECRET=super_secret_jwt_key
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://store-rating-platform-roxiler-assignment.onrender.com
```

---

## Deployment

- **Frontend:** Netlify
- **Backend:** Render
- **Database:** Railway MySQL

---

## Screenshots

- **Login**
  ![Login](https://github.com/user-attachments/assets/6fba6fc2-a421-486f-9f08-a5021e30ae9e)

- **Admin Dashboard**
  ![Admin Dashboard](https://github.com/user-attachments/assets/1c2b5663-9439-4cfc-80e1-97762c0e82b5)

- **User Dashboard**
  ![User Dashboard](https://github.com/user-attachments/assets/417754e8-549b-4630-9ed7-60e2a76c473b)

- **Store Owner Dashboard**
  ![Store Owner Dashboard](https://github.com/user-attachments/assets/775cbf94-7974-4656-87ed-7cc684c07e3c)

---

## Author

[Priyanshu Gautam](https://priyanshu-portf.netlify.app/)  
GitHub: https://github.com/Priyanshu57005  
LinkedIn: https://www.linkedin.com/in/priyanshu-gautam-12b5a0298/
