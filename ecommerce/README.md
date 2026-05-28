# ShopNow — MERN E-Commerce App

A full-stack Amazon/Flipkart-style e-commerce app built with MongoDB, Express, React, and Node.js.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` with your MongoDB URI:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

Start the backend:
```bash
npm run dev   # with nodemon (development)
# or
npm start     # production
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at: **http://localhost:5173**

---

## 👤 Demo Accounts

Register accounts via the Register page and select role:
- **User** — Browse products, add to cart, place orders
- **Admin** — All user permissions + add/edit/delete products

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Route handlers
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT + role protection
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/axios.js           # Axios instance with JWT
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx    # Auth state management
    │   │   └── CartContext.jsx    # Cart state management
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Products.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Orders.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🔌 API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login user |
| GET | /api/auth/me | User | Get current user |
| GET | /api/products | — | Get all products |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| GET | /api/cart | User | Get cart |
| POST | /api/cart/add | User | Add to cart |
| PUT | /api/cart/update/:id | User | Update quantity |
| DELETE | /api/cart/remove/:id | User | Remove item |
| POST | /api/orders/checkout | User | Place order |
| GET | /api/orders | User | Get my orders |

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Tailwind CSS, react-hot-toast
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs
- **Database**: MongoDB
