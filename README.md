Buzz Bizz
Project Overview
Buzz Bizz is a full-stack small business management application designed to simplify daily business operations, inventory tracking, customer and order management, and dynamic pricing calculations for small business owners.
The system allows users to register and manage their shop profile, organize products and stock levels, record customer orders, calculate optimal selling prices using interchangeable pricing strategies, and monitor business activity through automated event logging and a centralized dashboard.

Project Objectives
Simplify daily small business operations and record-keeping.

Maintain accurate relational records for users, products, customers, and orders in MySQL (buzz_bizz_db).

Automate order creation workflows (standard and express) with clean creational logic.

Calculate product selling prices, profits, and profit margins dynamically using multiple pricing strategies.

Provide decoupled event logging and low-stock threshold alerts via an observer mechanism.

Ensure code reliability and maintainability through software design patterns and automated unit testing.

Project Modules and Responsibilities
Module 1: Database & Data Access Layer (Singleton & Repository Patterns)
Main Files: config/db.js, repositories/UserRepository.js, repositories/ProductRepository.js, repositories/CustomerRepository.js, repositories/OrderRepository.js

Responsibilities:

Maintain a single shared MySQL connection pool instance across the server using the Singleton Pattern.

Encapsulate raw SQL queries and database schema mappings (full_name, password_hash, total_amount, final_amount) using the Repository Pattern.

Provide clean asynchronous CRUD operations for users, products, customers, and orders.

Module 2: Authentication & User Management (MVC Pattern)
Main Files: controllers/AuthController.js, routes/authRoutes.js, frontend/src/context/AuthContext.tsx, frontend/src/pages/Auth.tsx

Responsibilities:

Handle business owner registration (POST /api/auth/register) and login (POST /api/auth/login).

Hash user passwords securely using Node.js crypto before database persistence.

Validate user inputs, prevent duplicate email registrations, and maintain session state on the frontend.

Module 3: Order Creation & Management (Factory Pattern)
Main Files: factories/OrderFactory.js, repositories/OrderRepository.js, frontend/src/pages/Orders.tsx

Responsibilities:

Encapsulate order object instantiation inside OrderFactory.createOrder(...).

Support "standard" orders (status: "Pending") and "express" orders (status: "Confirmed", priority operational note).

Calculate line totals automatically and persist order records into MySQL.

Module 4: Dynamic Pricing Calculator (Strategy Pattern)
Main Files: strategies/PricingStrategy.js, controllers/PricingController.js, routes/pricingRoutes.js, frontend/src/pages/Pricing.tsx

Responsibilities:

Implement interchangeable pricing algorithms via FixedProfitStrategy, PercentageMarkupStrategy, and CostPlusOverheadStrategy.

Switch strategies dynamically at runtime through PricingContext.

Calculate recommended selling price, profit, and profit margin via POST /api/pricing/calculate.

Module 5: Event Logging & Low-Stock Alerts (Observer Pattern)
Main Files: observers/OrderObserver.js

Responsibilities:

Manage event subscriptions (order.created, stock.checked) using OrderEventSubject and orderEventBus.

Emit structured audit logs ([OBSERVER - LOG]) via activityLogObserver.

Trigger automated low-stock alerts ([OBSERVER - STOCK ALERT]) via lowStockObserver.

Module 6: Frontend Dashboard & Business Operations UI
Main Files: frontend/src/pages/Dashboard.tsx, Products.tsx, Inventory.tsx, Customers.tsx, Finance.tsx, Profile.tsx, frontend/src/context/AppContext.tsx

Responsibilities:

Display key business metrics, revenue summaries, pending orders, and low-stock indicators.

Provide interactive interfaces for managing products, inventory, customers, orders, finances, and shop branding.

Connect UI workflows to backend REST APIs and centralized React Context state.

Technologies Used
Frontend: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Lucide React, Recharts

Backend: Node.js, Express.js, JavaScript (CommonJS)

Database: MySQL (buzz_bizz_db) with mysql2 connection pooling

Security & Configuration: Node.js crypto module, dotenv (.env), cors

Testing: Node.js Built-in Test Runner (node:test & node:assert/strict)

Version Control: Git and GitHub

Development Environment: Visual Studio Code

Project Structure
Plaintext
Buzz_Bizz_Web/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Singleton MySQL connection pool
│   ├── controllers/
│   │   ├── AuthController.js     # Registration & login request handlers
│   │   └── PricingController.js  # Pricing calculation endpoint handler
│   ├── factories/
│   │   └── OrderFactory.js       # Standard & express order factory
│   ├── models/                   # Domain data models
│   ├── observers/
│   │   └── OrderObserver.js      # Event bus, audit logger & stock alert observer
│   ├── repositories/
│   │   ├── UserRepository.js
│   │   ├── ProductRepository.js
│   │   ├── CustomerRepository.js
│   │   └── OrderRepository.js
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/register & /api/auth/login
│   │   └── pricingRoutes.js      # /api/pricing/calculate
│   ├── strategies/
│   │   └── PricingStrategy.js    # Fixed, percentage & cost-plus pricing strategies
│   ├── tests/
│   │   ├── pricingStrategy.test.js # 4 unit tests for PricingStrategy
│   │   ├── orderFactory.test.js    # 3 unit tests for OrderFactory
│   │   └── orderObserver.test.js   # 3 unit tests for OrderObserver
│   ├── .env                      # Environment variables (excluded from Git)
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   └── buzz-bizz-frontendv1/
│       ├── src/
│       │   ├── assets/           # Brand logos and static assets
│       │   ├── components/       # Reusable UI components
│       │   ├── context/
│       │   │   ├── AuthContext.tsx
│       │   │   └── AppContext.tsx
│       │   ├── data/             # Static types and constants
│       │   ├── pages/
│       │   │   ├── Auth.tsx
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Products.tsx
│       │   │   ├── Inventory.tsx
│       │   │   ├── Orders.tsx
│       │   │   ├── Customers.tsx
│       │   │   ├── Pricing.tsx
│       │   │   ├── Finance.tsx
│       │   │   └── Profile.tsx
│       │   ├── services/         # API communication helpers
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── styles.css
│       │   └── vite-env.d.ts
│       ├── index.html
│       ├── package.json
│       └── tsconfig.json
│
├── .gitignore
└── README.md
How the System Works
Launch & Authenticate: Start the MySQL database, Node.js/Express backend (http://localhost:5000), and React + Vite frontend, then register or sign in as a business owner.

Manage Shop & Products: Configure shop branding details and add products with cost prices, selling prices, and stock thresholds.

Manage Customers & Orders: Record customer profiles and create "standard" or "express" orders via OrderFactory, persisting records in MySQL.

Calculate Dynamic Pricing: Select a pricing strategy (fixed, percentage, or cost-plus) in the Pricing Calculator to compute recommended prices, profit, and profit margins.

Monitor Events & Dashboard: Track automated audit logs and low-stock alerts emitted by OrderObserver, and review business summaries on the Dashboard.

Verify Logic via Unit Tests: Execute node --test tests/*.test.js in the backend directory to run all 10 unit tests across pricing strategies, order creation, and observer notifications.

Design Patterns Summary
Pattern	Category	Main File(s)	Role in Buzz Bizz
Singleton	Creational	config/db.js	Shares a single MySQL connection pool across all repositories.
Repository	Architectural	repositories/*Repository.js	Encapsulates SQL queries and schema column mappings.
MVC	Architectural	models/, controllers/, routes/, src/	Separates data persistence, request orchestration, and UI views.
Factory	Creational	factories/OrderFactory.js	Instantiates standard and express orders with default statuses and totals.
Strategy	Behavioral	strategies/PricingStrategy.js	Dynamically executes fixed, percentage, and cost-plus pricing formulas.
Observer	Behavioral	observers/OrderObserver.js	Subscribes to order.created and stock.checked events for logging and alerts.
Version Control and Collaboration
This project uses Git and GitHub for structured development and integration:

Separate branches (such as Backend and feature branches) are used to isolate backend and frontend development.

Changes are committed with clear, descriptive commit messages.

Pull Requests (PRs) are created with detailed implementation summaries, testing notes, and code reviews before merging into the main repository.

.gitignore excludes node_modules/ and .env files to keep the repository clean and secure.

Future Enhancements
Full end-to-end API synchronization for expenses, payments, and analytics charts.

Role-based access control (RBAC) for staff and store managers.

Exportable financial and inventory reports in PDF and Excel formats.

Automated invoice generation and customer order notifications.

Cloud image storage for shop logos, banners, and product photos.

Conclusion
Buzz Bizz provides small business owners with a centralized, modular, and scalable platform to manage daily operations. By combining a responsive React + TypeScript interface with a Node.js, Express, and MySQL backend structured around six core software design patterns and verified by automated unit tests, the application delivers a reliable and maintainable small business management solution.

Project: Buzz Bizz

Category: Software Engineering / Full-Stack Web Application

Development Approach: Modular Full-Stack & Design-Pattern-Driven Development
