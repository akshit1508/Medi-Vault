# MediVault: Modern Medical Store Management & Smart Expiry System

MediVault has been completely transitioned from legacy Jakarta Servlets + HTML/CSS to a modern enterprise stack:
- **Backend**: **Spring Boot 3.3.4 (Java 21 LTS)** with Spring Data JPA, Spring Security (JWT), and MySQL.
- **Frontend**: **Next.js 14+ (App Router)** with TypeScript, Tailwind CSS, and Lucide Icons.

---

## 🏗️ Architecture Overview

```
MediVault/
├── backend/                   # Spring Boot 3 Backend
│   ├── src/main/java/com/medivault/
│   │   ├── config/            # SecurityConfig, CORS
│   │   ├── controller/        # REST APIs (Auth, Products, Billing, Alerts, Reports, Customers, Suppliers)
│   │   ├── dto/               # Clean Request/Response DTOs
│   │   ├── entity/            # JPA Entities (User, Product, Customer, Supplier, Bill, BillItem)
│   │   ├── exception/         # GlobalExceptionHandler
│   │   ├── repository/        # Spring Data JPA Repositories
│   │   ├── security/          # Spring Security 6 & JWT Token Filter
│   │   └── service/           # @Transactional Business Logic
│   └── pom.xml
│
└── frontend/                  # Next.js 14+ App Router Frontend
    ├── app/
    │   ├── page.tsx           # Modern Landing Page
    │   ├── login/             # Login & Forgot Password Recovery
    │   ├── register/          # User Registration
    │   ├── dashboard/         # Dashboard with KPI Cards & Auto-Alert Modal
    │   ├── products/          # Inventory CRUD, A-Z index, formulation & batch search
    │   ├── billing/           # Real-time POS Billing Terminal & Printable Invoice
    │   ├── alerts/            # Dedicated Notification Center (Expiry + Low Stock)
    │   ├── reports/           # Sales Analytics (Day/Month/Year filters & print view)
    │   ├── customers/         # Customer Management
    │   └── suppliers/         # Vendor & Supplier Directory
    ├── components/            # Sidebar Navigation & Reusable Widgets
    ├── lib/api.ts             # API Client connected to Spring Boot
    └── types/                 # TypeScript Models
```

---

## 🚀 Running the Project

### 1. Database Setup (MySQL)
Ensure your MySQL server is running on `localhost:3306`:
* Database name: `medivault` (auto-created if not exists)
* Default credentials configured in `backend/src/main/resources/application.properties`:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/medivault?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
  spring.datasource.username=root
  spring.datasource.password=root
  ```

### 2. Start Spring Boot Backend
Open a terminal in the root folder:
```bash
cd backend
mvn spring-boot:run
```
* Backend API base URL: `http://localhost:8080/api/v1`

### 3. Start Next.js Frontend
Open a second terminal in the root folder:
```bash
cd frontend
npm run dev
```
* Open your browser and navigate to: `http://localhost:3000`

---

## ⚡ Core Features & Modernizations

1. **Smart 15-Day Expiry Warnings**: Automated triggers immediately detect medications approaching their expiration date upon logging in, matching and enhancing the legacy `ExpiryCode.java` popup.
2. **Low-Stock Safety Alerts**: Real-time alerts when product quantity drops below the user-defined threshold.
3. **Atomic POS Billing**: Thread-safe `@Transactional` inventory deductions prevent negative stock or race conditions during checkout. Generates thermal and A4 print receipts.
4. **Unified Inventory Search**: Search seamlessly across drug formulation, batch number, brand name, or starting alphabet in a single view.
5. **Secure Authentication**: Spring Security 6 with stateless JWT tokens and BCrypt hashed passwords, replacing legacy plain-text storage.
