# Product-Admin-Dashboard - NexusStore Enterprise Management System

A modern, responsive, and feature-complete e-commerce product management dashboard built with **Next.js 15 (App Router)**, **React 19**, and **Vanilla CSS**. Designed for high performance, visual elegance, and seamless inventory administration using the [DummyJSON](https://dummyjson.com) API.

---

## 🌟 Key Features

### 1. Authentication & Route Security
- **JWT-based Auth**: Intercepts requests and attaches bearer tokens dynamically.
- **Protected Routes**: Secure wrapper (`ProtectedRoute`) ensuring unauthorized users cannot access dashboard, product creation, or edit views.
- **One-Click Demo Credentials**: Pre-configured test accounts on the login screen:
  - **Emily Johnson**: `emilys` / `emilyspass`
  - **Michael Williams**: `michaelw` / `michaelwpass`
- **Session Persistence**: Stores auth state and user information in `localStorage` across page reloads.
- **Sign Out Flow**: Destroys active tokens and redirects to the login screen.

### 2. Product Catalog & Inventory Dashboard
- **Overview Metrics**: Live analytics cards showing total items (194), active categories, average rating, and low-stock alerts.
- **Dual View Modes**:
  - **Table View**: Detailed table with thumbnail previews, categories, prices, star ratings, stock status indicators, and action buttons.
  - **Card Grid View**: Modern responsive product cards with hover zoom, discount badges, and quick-action shortcuts.
- **Real-Time Search**: Debounced search (`UI_CONFIG.DEBOUNCE_DELAY = 500ms`) by title, brand, or SKU with quick-clear button.
- **Category Filter**: Dynamically populated from `GET /products/categories`.
- **Advanced Sorting**:
  - Price: Low to High
  - Price: High to Low
  - Rating: High to Low
  - Title: A to Z
- **Pagination Controls**: Configurable items-per-page (10, 20, 50) and numbered navigation with truncation (`1 ... 4 5 6 ... 20`).

### 3. Full CRUD Operations
- **Add Product (`/dashboard/products/add`)**:
  - Validated inputs matching `VALIDATION_RULES` (title length, price ranges, inventory count, description length).
  - Live image preview box.
  - Category selector.
- **Edit Product (`/dashboard/products/edit/[id]`)**:
  - Pre-fills current product details.
  - Updates locally and reflects instantly across lists, cards, and detail pages.
- **View Product Details (`/dashboard/[id]`)**:
  - Image gallery with interactive thumbnail switcher.
  - Discount calculation and savings badge.
  - Shipping, warranty, and return policy metadata.
  - Verified customer reviews with star ratings and reviewer names.
- **Delete Product**:
  - Glassmorphic modal confirmation dialog.
  - Immediate optimistic removal from state and persistent local cache.

### 4. Toast Notification System
- Non-intrusive floating feedback messages for all actions (`Product added`, `Product updated`, `Product deleted`, `Login success`, etc.).
- Auto-dismisses after 3 seconds.

---

## 🛠️ Project Structure

```
React_assignment/
├── src/
│   ├── api/
│   │   ├── axiosInstance.js     # Configured Axios with auth interceptors
│   │   ├── authAPI.js           # Authentication API calls
│   │   ├── categoriesAPI.js     # Categories listing API
│   │   └── productsAPI.js       # Products CRUD endpoints
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── [id]/page.js     # Product detail view
│   │   │   ├── products/
│   │   │   │   ├── add/page.js  # Add product form
│   │   │   │   └── edit/[id]/   # Edit product form
│   │   │   └── page.js          # Main inventory dashboard
│   │   ├── login/
│   │   │   └── page.js          # Authentication portal
│   │   ├── globals.css          # Design system & dark mode aesthetics
│   │   ├── layout.js            # Root layout with context providers
│   │   └── page.js              # Entry redirect logic
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.js
│   │   ├── layout/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   └── products/
│   │       ├── DeleteConfirmModal.js
│   │       ├── Pagination.js
│   │       ├── ProductFilters.js
│   │       ├── ProductForm.js
│   │       ├── ProductGrid.js
│   │       ├── ProductTable.js
│   │       └── StatsOverview.js
│   ├── context/
│   │   ├── AuthContext.js       # App-wide authentication context
│   │   ├── ProductContext.js    # State management, caching & optimistic updates
│   │   └── ToastContext.js      # Toast notification manager
│   ├── hooks/
│   │   └── useAuth.js           # Authentication lifecycle hook
│   └── utils/
│       └── constants.js         # API endpoints, validation rules & routes
├── next.config.mjs
├── package.json
└── jsconfig.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Production Build
```bash
npm run build
npm start
```

