🛒 ShopNow — MERN E-Commerce App

A full-stack Amazon/Flipkart-style E-Commerce application built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

🚀 Live Demo
🌐 Frontend
https://ecommerce-frontend-opal-three.vercel.app

⚙️ Backend API
https://ecommerce-backend-uh2j.onrender.com

✨ Features
👤 User Features
User Registration & Login
JWT Authentication & Authorization
Browse Products
View Product Details
Add Products to Cart
Update Cart Quantity
Remove Items from Cart
Checkout & Place Orders
View Order History
🛠️ Admin Features
Add New Products
Edit Existing Products
Delete Products
Manage Product Inventory
🎨 UI Features
Responsive Design
Modern User Interface
Toast Notifications
Protected Routes
Loading States & Error Handling
🛠 Tech Stack
Frontend
React 18
Vite
React Router DOM v6
Axios
Tailwind CSS
react-hot-toast
Backend
Node.js
Express.js
JWT Authentication
bcryptjs
Database
MongoDB
Mongoose
🚀 Quick Start
📌 Prerequisites

Make sure you have installed:

Node.js (v18+)
MongoDB (Local or MongoDB Atlas)
⚙️ Backend Setup
cd backend
npm install

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development

Start Backend Server:

npm run dev

OR

npm start
🎨 Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173
👤 Demo Accounts

Register an account from the Register page and select a role:

👤 User
Browse Products
Add to Cart
Place Orders
🛠️ Admin
All User Permissions
Add/Edit/Delete Products

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
🔌 API Endpoints
Method	Route	Access	Description
POST	/api/auth/register	Public	Register User
POST	/api/auth/login	Public	Login User
GET	/api/auth/me	User	Get Current User
GET	/api/products	Public	Get All Products
POST	/api/products	Admin	Create Product
PUT	/api/products/:id	Admin	Update Product
DELETE	/api/products/:id	Admin	Delete Product
GET	/api/cart	User	Get Cart
POST	/api/cart/add	User	Add To Cart
PUT	/api/cart/update/:id	User	Update Cart Quantity
DELETE	/api/cart/remove/:id	User	Remove Cart Item
POST	/api/orders/checkout	User	Place Order
GET	/api/orders	User	Get User Orders
🌐 API Links
Products API

https://ecommerce-backend-uh2j.onrender.com/api/products

Login API

https://ecommerce-backend-uh2j.onrender.com/api/auth/login

Register API

https://ecommerce-backend-uh2j.onrender.com/api/auth/register

Cart API

https://ecommerce-backend-uh2j.onrender.com/api/cart

Orders API

https://ecommerce-backend-uh2j.onrender.com/api/orders

📚 What I Learned
Full-Stack MERN Development
REST API Design
Authentication & Authorization
MongoDB Database Operations
Frontend & Backend Integration
State Management
Responsive UI Design

👨‍💻 Author
Akshaya Vasireddi

GitHub:
https://github.com/Akshaya-Vasireddi
