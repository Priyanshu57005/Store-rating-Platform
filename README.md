# RatingHub - Store Rating Platform

A full-stack web application built as part of the Roxiler Systems Full Stack Coding Challenge.

The platform allows users to rate stores, store owners to view ratings for their stores, and administrators to manage users, stores, and platform statistics.

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

- MySQL

---

## Features

### Admin

- Login as administrator
- Dashboard showing
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
|--------|------------|
| Name | 20–60 characters |
| Address | Maximum 400 characters |
| Password | 8–16 characters, one uppercase letter and one special character |
| Email | Standard email format |

Validation is implemented on both the frontend and backend.

---

## Test Accounts

### Admin

Email

```
admin@storerating.com
```

Password

```
Admin@1234Password
```

---

### Store Owner

Email

```
owner.marcus@techemporium.com
```

Password

```
Owner@1234Password
```

---

### User

Email

```
christopher.davis@example.com
```

Password

```
User@1234Password
```

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
git clone <https://github.com/Priyanshu57005/Store-rating-Platform-Roxiler-Assignment>
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

npm run dev
```

---

## Environment Variables

Backend

```env
DATABASE_URL=

JWT_SECRET=

NODE_ENV=development
```

Frontend

```env
VITE_API_URL=http://localhost:5000
```

---

## Deployment

Frontend

- Netlify

Backend

- Render

Database

- Railway MySQL

---

## Screenshots

- Login
- <img width="1919" height="1145" alt="image" src="https://github.com/user-attachments/assets/6fba6fc2-a421-486f-9f08-a5021e30ae9e" />

- Admin Dashboard
- <img width="1742" height="1071" alt="image" src="https://github.com/user-attachments/assets/1c2b5663-9439-4cfc-80e1-97762c0e82b5" />

- User Dashboard
- <img width="1919" height="1081" alt="image" src="https://github.com/user-attachments/assets/417754e8-549b-4630-9ed7-60e2a76c473b" />

- Store Owner Dashboard
- <img width="1486" height="1010" alt="image" src="https://github.com/user-attachments/assets/775cbf94-7974-4656-87ed-7cc684c07e3c" />


---

## Author

[Priyanshu Gautam](https://priyanshu-portf.netlify.app/)

GitHub: https://github.com/Priyanshu57005

LinkedIn: https://www.linkedin.com/in/priyanshu-gautam-12b5a0298/
