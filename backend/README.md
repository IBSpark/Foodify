# Foodify 🍽️

Foodify is a full-stack restaurant management system built with modern web technologies. The project includes:

* Customer Frontend Website
* Admin Dashboard
* Backend REST API
* MongoDB Database

The system is designed as a real-world production-ready application with deployment support for GitHub, Vercel, Render, and MongoDB Atlas.

---

# 🚀 Features

## Customer Frontend

* Modern restaurant landing page
* Hero section
* About section
* Dynamic menu display
* Reservation system
* Responsive UI

## Admin Dashboard

* Dashboard analytics
* Menu management
* Add / Edit / Delete menu items
* Reservation management
* Order overview
* Real-time statistics

## Backend API

* RESTful API architecture
* MongoDB database integration
* JWT Authentication
* Protected admin routes
* CRUD operations
* Scalable folder structure

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Material UI
* Bootstrap
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcrypt
* dotenv
* cors

---

# 📁 Project Structure

```bash
foodify/
│
├── frontend/          # Customer Website
├── admin/             # Admin Dashboard
├── backend/           # Express Backend API
│
├── README.md
└── .gitignore
```

---

# 📁 Backend Structure

```bash
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── menuController.js
│   └── reservationController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── Admin.js
│   ├── Menu.js
│   └── Reservation.js
│
├── routes/
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   └── reservationRoutes.js
│
├── .env
├── package.json
└── server.js
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/foodify.git
cd foodify
```

---

# 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```bash
http://localhost:3001
```

---

# 🛡️ Admin Dashboard Setup

```bash
cd admin
npm install
npm start
```

Admin dashboard runs on:

```bash
http://localhost:3001
```

---

# 🔥 Backend Setup

```bash
cd backend
npm install
npm start
```

Backend server runs on:

```bash
http://localhost:3000
```

---

# 🌍 MongoDB Atlas Setup

Create a `.env` file inside backend folder:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# 📡 API Endpoints

## Menu Routes

```bash
GET    /api/menu
POST   /api/menu
PUT    /api/menu/:id
DELETE /api/menu/:id
```

## Reservation Routes

```bash
GET    /api/reservations
POST   /api/reservations
DELETE /api/reservations/:id
```

## Auth Routes

```bash
POST /api/auth/login
```

---

# 🔐 Authentication

Foodify uses JWT authentication for admin login.

Protected routes require:

```bash
Authorization: Bearer TOKEN
```

---

# 🚀 Deployment

## Frontend Deployment

* Vercel

## Admin Dashboard Deployment

* Vercel

## Backend Deployment

* Render

## Database

* MongoDB Atlas

---

# 📌 Future Features

* Online ordering system
* Payment gateway integration
* Customer authentication
* Real-time order tracking
* Analytics dashboard
* Image upload system
* Cloudinary integration

---

# 👨‍💻 Developer

Developed by the Foodify Team.

---

# 📄 License

This project is licensed for educational and portfolio purposes.
