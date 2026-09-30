# Electronics Decision Assistant (MERN)

Compare electronics by budget, specs and preference. JWT auth, MongoDB, Express, React (Vite).

## Requirements
- Node.js 18+
- MongoDB running locally (mongodb://127.0.0.1:27017) or a MongoDB Atlas URI

## Setup

### 1. Backend
```
cd server
npm install
copy .env.example .env      (Windows)   |   cp .env.example .env   (Mac/Linux)
npm run seed                # adds sample products into MongoDB
npm run dev                 # starts API on http://localhost:5000
```

### 2. Frontend (new terminal)
```
cd client
npm install
npm run dev                 # opens on http://localhost:5173
```

Register an account in the UI, then use Products / Recommend / Compare / Add Product.

## API
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | - | name, email, password |
| POST | /api/auth/login | - | email, password -> token |
| GET | /api/auth/me | JWT | current user |
| GET | /api/products | - | filters: category, brand, search, minPrice, maxPrice, sort |
| GET | /api/products/recommend | - | category, budget, priority (performance/battery/camera/display/value) |
| GET | /api/products/:id | - | single product |
| POST | /api/products | JWT | create product |
| DELETE | /api/products/:id | JWT | delete your own product |

## Folder structure
```
server/  config, models (User, Product), middleware (auth), routes, seed
client/  src/components (Auth, Products, Recommend, Compare, AddProduct)
```
