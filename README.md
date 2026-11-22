# Buzz Bizz — Business Management System

<p align="center">

  **Your Business, Simplified.**

  A full-stack business management application designed to help small business owners streamline daily operations, manage inventory, track orders, and make informed pricing decisions.

  <br/>

  **React 19 · TypeScript · Node.js · Express · MySQL**

</p>

---

## Table of Contents

- [Project Overview](#-project-overview)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Design Patterns](#-design-patterns)
- [How the System Works](#-how-the-system-works)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Version Control and Collaboration](#-version-control-and-collaboration)
- [Future Enhancements](#-future-enhancements)
- [Project Information](#-project-information)

---

## Project Overview

**Buzz Bizz** is a full-stack Business Management System developed to simplify and centralize everyday business operations for small business owners.

The application provides a unified platform for managing products, inventory, customers, orders, expenses, payments, and pricing calculations. It also features a centralized dashboard that presents important business information, helping owners monitor performance and maintain better control over their operations.

The system combines a responsive React-based frontend with a Node.js and Express backend, supported by a MySQL relational database.

To promote maintainability, scalability, and clean software architecture, the backend incorporates six software design patterns:

- Singleton
- Repository
- MVC (Model-View-Controller)
- Factory
- Strategy
- Observer

Automated unit testing is performed using Node.js's built-in testing framework to verify the correctness of important business logic.

## Project Objectives

The primary objectives of Buzz Bizz are to:

1. Simplify daily business operations through a centralized management platform.
2. Maintain organized records of business owners, products, customers, and orders.
3. Track available and reserved inventory and support automated stock updates.
4. Streamline order creation and management through reusable business logic.
5. Calculate selling prices, estimated profits, and profit margins using interchangeable pricing strategies.
6. Generate low-stock alerts and maintain automated activity logs through an event-driven observer mechanism.
7. Provide business owners with a dashboard for monitoring sales, revenue, expenses, pending orders, and inventory.
8. Improve software maintainability and reliability through established design patterns and automated unit testing.

---

## Key Features

### 1. Authentication and Profile Management

- Business owner registration and login.
- Profile viewing and updating.
- Shop profile customization and branding.
- Password hashing before database persistence.
- Account deletion functionality.

### 2. Product Management

- Add, view, update, and delete products.
- Organize products into categories.
- Maintain product cost and selling prices.
- Upload, preview, replace, and remove product images.
- Calculate estimated profit per product.

### 3. Inventory Management

- Maintain product stock quantities.
- Track available and reserved inventory.
- Update stock based on order confirmation and cancellation.
- Configure minimum stock thresholds.
- Identify products requiring restocking.

### 4. Order Management

- Create and manage customer orders.
- Support standard and express order creation.
- Calculate order totals automatically.
- Track order statuses:
  - Pending
  - Confirmed
  - Processing
  - Delivered
  - Cancelled
- Apply inventory updates during relevant order status transitions.

### 5. Customer Management

- Maintain customer records.
- Store customer names and contact information.
- Add, view, update, and delete customer records.
- Maintain customer-related order history.

### 6. Expense Management

- Record and manage business expenses.
- Organize expenses into categories, including:
  - Raw materials
  - Packaging
  - Labour
  - Delivery
- Monitor business expenditure.

### 7. Dynamic Pricing Calculator

The pricing calculator supports three interchangeable pricing strategies:

| Pricing Strategy | Calculation |
|---|---|
| Fixed-Profit | Product Cost + Fixed Profit |
| Percentage-Based | Product Cost × (1 + Markup Percentage / 100) |
| Cost-Plus | (Product Cost + Overhead) × (1 + Markup Percentage / 100) |

The calculator dynamically determines:

- Recommended selling price
- Estimated profit
- Profit margin

### 8. Payment Management

- Record cash payments associated with customer orders.
- Maintain payment records.
- Track payments against customer orders.

### 9. Business Dashboard

The dashboard provides a centralized overview of business performance, including:

- Sales and revenue summaries.
- Business expenses.
- Estimated profits.
- Pending orders.
- Inventory summaries.
- Low-stock indicators.
- Recent order activity.
- Sales data visualization.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Building the user interface using reusable components |
| TypeScript | Type safety and structured development |
| Vite | Frontend development server and build tool |
| Tailwind CSS v4 | Utility-first styling |
| React Router v7 | Navigation and routing between pages |
| Lucide React | Icons |
| Recharts | Dashboard charts and data visualization |
| React Context API | Centralized application state management |
| LocalStorage | Browser-side session and application data persistence |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime for server-side development |
| Express.js | Backend framework for REST API development |
| JavaScript (CommonJS) | Backend application logic |
| mysql2 | MySQL database connectivity and connection pooling |

### Database

| Technology | Purpose |
|---|---|
| MySQL | Relational database management |
| buzz_bizz_db | Project database |
| MySQL Connection Pool | Efficient database connection management |

### Security and Configuration

| Technology | Purpose |
|---|---|
| Node.js Crypto | Password hashing |
| dotenv | Environment variable management |
| CORS | Cross-Origin Resource Sharing configuration |

### Testing and Development

| Technology | Purpose |
|---|---|
| node:test | Built-in Node.js unit testing framework |
| node:assert/strict | Strict assertions for verifying test results |
| Git | Version control |
| GitHub | Repository hosting and collaboration |
| Visual Studio Code | Development environment |

---

## System Architecture

Buzz Bizz follows a modular full-stack architecture that separates the frontend, backend business logic, and database access responsibilities.

```text
                 BUSINESS OWNER
                        |
                        v
             +----------------------+
             |     React Frontend   |
             |                      |
             |  React 19 + TS       |
             |  Vite                |
             |  React Router        |
             |  React Context       |
             +----------------------+
                        |
                        | HTTP / REST API
                        v
             +----------------------+
             |   Express Backend    |
             |                      |
             |  Routes              |
             |  Controllers         |
             |  Business Logic      |
             |  Design Patterns     |
             +----------------------+
                        |
                        v
             +----------------------+
             |   Repository Layer   |
             |                      |
             |  User Repository     |
             |  Product Repository  |
             |  Customer Repository |
             |  Order Repository    |
             +----------------------+
                        |
                        v
             +----------------------+
             |     MySQL Database   |
             |                      |
             |     buzz_bizz_db     |
             +----------------------+
```

### Architectural Responsibilities

- **Frontend:** Handles user interaction, navigation, forms, visualizations, and application state.
- **Routes:** Define backend API endpoints and connect requests to appropriate controllers.
- **Controllers:** Handle incoming requests, coordinate business operations, and return responses.
- **Business Logic:** Implements pricing calculations, order creation, and event-related operations.
- **Repositories:** Encapsulate SQL queries and database access.
- **Database:** Maintains persistent relational business records.

---

## Project Structure

The repository is organized into separate frontend and backend directories to support modular development.

```text
Buzz_Bizz_Web/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── AuthController.js
│   │   └── PricingController.js
│   │
│   ├── factories/
│   │   └── OrderFactory.js
│   │
│   ├── models/
│   │
│   ├── observers/
│   │   └── OrderObserver.js
│   │
│   ├── repositories/
│   │   ├── UserRepository.js
│   │   ├── ProductRepository.js
│   │   ├── CustomerRepository.js
│   │   └── OrderRepository.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── pricingRoutes.js
│   │
│   ├── strategies/
│   │   └── PricingStrategy.js
│   │
│   ├── tests/
│   │   ├── pricingStrategy.test.js
│   │   ├── orderFactory.test.js
│   │   └── orderObserver.test.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   └── buzz-bizz-frontendv1/
│       │
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   │   ├── AuthContext.tsx
│       │   │   └── AppContext.tsx
│       │   │
│       │   ├── data/
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
│       │   │
│       │   ├── services/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── styles.css
│       │   └── vite-env.d.ts
│       │
│       ├── index.html
│       ├── package.json
│       └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## Design Patterns

Six software design patterns are incorporated into Buzz Bizz to improve code organization, reusability, extensibility, and maintainability.

| Design Pattern | Category | Implementation | Purpose |
|---|---|---|---|
| Singleton | Creational | `config/db.js` | Maintains a shared MySQL connection pool across the application. |
| Repository | Architectural | `repositories/` | Encapsulates SQL queries and separates data access from business logic. |
| MVC | Architectural | `models/`, `controllers/`, `routes/` | Separates application responsibilities into structured layers. |
| Factory | Creational | `factories/OrderFactory.js` | Creates different order types with appropriate default values and behavior. |
| Strategy | Behavioral | `strategies/PricingStrategy.js` | Provides interchangeable pricing algorithms. |
| Observer | Behavioral | `observers/OrderObserver.js` | Responds to application events through logging and low-stock notifications. |

### 1. Singleton Pattern

**Implementation:** `backend/config/db.js`

The Singleton Pattern ensures that the backend uses a shared MySQL connection pool rather than creating independent database connections throughout the application.

### 2. Repository Pattern

**Implementation:** `backend/repositories/`

The Repository Pattern separates database operations from business logic. Dedicated repositories encapsulate SQL queries and provide asynchronous CRUD operations for users, products, customers, and orders.

### 3. MVC Pattern

**Implementation:** `backend/models/`, `backend/controllers/`, and `backend/routes/`

The Model-View-Controller architectural pattern separates data representation, request handling, and application presentation.

In the backend, routes direct incoming requests to controllers, which coordinate the relevant models and business operations. The React frontend provides the user-facing views.

### 4. Factory Pattern

**Implementation:** `backend/factories/OrderFactory.js`

The Factory Pattern centralizes order creation and supports different order types without exposing object initialization details to the calling code.

The factory supports:

- Standard orders: Created with a Pending status.
- Express orders: Created with a Confirmed status and an express-priority operational note.

Order totals are calculated automatically.

### 5. Strategy Pattern

**Implementation:** `backend/strategies/PricingStrategy.js`

The Strategy Pattern encapsulates pricing algorithms into interchangeable strategies, allowing the application to select a calculation method dynamically.

Implemented strategies:

- `FixedProfitStrategy`
- `PercentageMarkupStrategy`
- `CostPlusOverheadStrategy`

### 6. Observer Pattern

**Implementation:** `backend/observers/OrderObserver.js`

The Observer Pattern provides an event-driven mechanism for responding to application events without tightly coupling event producers to event handlers.

The implementation includes:

- `OrderEventSubject`
- `orderEventBus`
- `activityLogObserver`
- `lowStockObserver`

Supported events include:

- `order.created`
- `stock.checked`

The observers generate structured activity logs and low-stock alerts when the relevant conditions occur.

---

## How the System Works

### 1. Launch and Authentication

The business owner starts the MySQL database, backend server, and frontend application.

The owner can register a new account or sign in using existing credentials.

### 2. Shop and Product Management

After authentication, the owner can configure shop profile information and branding, create product records, assign categories, and maintain product costs, selling prices, and stock thresholds.

### 3. Customer and Order Management

The owner can maintain customer records and create standard or express orders.

The Order Factory handles order initialization, calculates order totals, and supports the appropriate default order status.

Order information is managed through the repository and database layers.

### 4. Dynamic Pricing

The owner selects a pricing strategy and enters the required product cost and pricing parameters.

The Strategy Pattern executes the selected algorithm and returns the recommended selling price, estimated profit, and profit margin.

### 5. Event Monitoring

When relevant order and stock events occur, the Observer mechanism notifies subscribed observers.

The activity logging observer records structured event information, while the low-stock observer generates alerts when stock falls below the configured threshold.

### 6. Dashboard Monitoring

The dashboard provides a consolidated view of business activity, including financial summaries, pending orders, sales information, and inventory indicators.

---

## Getting Started

Follow these instructions to set up Buzz Bizz locally.

### Prerequisites

Ensure that the following software is installed:

- [Node.js](https://nodejs.org/)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate into the project directory:

```bash
cd Buzz_Bizz_Web
```

### 2. Set Up the MySQL Database

Start your MySQL server and create the project database:

```sql
CREATE DATABASE buzz_bizz_db;
```

Ensure that the database schema required by the application is created before starting the backend.

### 3. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory and configure the database credentials and server settings according to the environment variables used in `config/db.js` and `server.js`.

**Important:** Do not commit `.env` files or expose database credentials in the repository.

### 4. Start the Backend Server

From the backend directory, run:

```bash
node server.js
```

The backend server is configured to run at:

```text
http://localhost:5000
```

### 5. Set Up the Frontend

Open a separate terminal and navigate to:

```bash
cd frontend/buzz-bizz-frontendv1
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

---

## API Endpoints

The following REST API endpoints are documented for the backend.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new business owner |
| POST | `/api/auth/login` | Authenticate an existing business owner |

### Pricing

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/pricing/calculate` | Calculate selling price, estimated profit, and profit margin using the selected pricing strategy |

The backend API is designed to support communication between the React frontend and server-side business logic.

---

## Testing

Buzz Bizz uses the built-in Node.js testing framework to verify the correctness of its core business logic.

### Testing Technologies

- `node:test` — Test execution and organization.
- `node:assert/strict` — Strict assertions for validating expected results.

### Unit Test Files

| Test File | Functionality Tested | Number of Tests |
|---|---|---:|
| `pricingStrategy.test.js` | Fixed-profit, percentage-based, and cost-plus pricing calculations | 4 |
| `orderFactory.test.js` | Standard and express order creation and initialization | 3 |
| `orderObserver.test.js` | Event subscriptions, activity logging, and low-stock notifications | 3 |
| **Total** | | **10** |

### Execute the Tests

Navigate to the backend directory:

```bash
cd backend
```

Run all unit tests:

```bash
node --test tests/*.test.js
```

The Node.js test runner executes the test files and reports the results, including passed and failed test cases.

### Testing Objectives

The tests focus on:

- Correctness of pricing calculations.
- Appropriate order initialization.
- Standard and express order behavior.
- Event subscription and notification handling.
- Low-stock alert generation.
- Expected results and error conditions.

---

## Version Control and Collaboration

Git and GitHub are used to manage source code, track changes, and coordinate development.

The collaboration workflow includes:

- Separate branches for frontend, backend, and individual features.
- Meaningful and descriptive commit messages.
- Pull Requests for reviewing and integrating changes.
- Code reviews before merging into the main branch.
- A `.gitignore` file to exclude `node_modules/`, `.env`, and other unnecessary or sensitive files.

This workflow helps maintain code organization, reduce integration conflicts, and support collaborative development.

---

## Future Enhancements

The following features are planned for future development:

- Complete end-to-end API synchronization for expenses, payments, and dashboard analytics.
- Role-based access control for staff members and store managers.
- Exportable financial and inventory reports in PDF and Excel formats.
- Automated invoice generation.
- Customer order notifications.
- Cloud-based image storage for shop logos, banners, and product photographs.
- Expanded automated testing and integration testing.

---

## Project Information

| Attribute | Details |
|---|---|
| Project Name | Buzz Bizz |
| Project Category | Software Engineering / Full-Stack Web Application |
| Application Type | Small Business Management System |
| Frontend | React 19, TypeScript, Vite |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Architecture | Modular Full-Stack Architecture |
| Design Patterns | Singleton, Repository, MVC, Factory, Strategy, Observer |
| Testing Framework | Node.js Built-in Test Runner |
| Version Control | Git and GitHub |

---

## Conclusion

**Buzz Bizz — Your Business, Simplified.**

Buzz Bizz brings essential small business management operations together in one centralized application. From product and inventory management to customer orders, pricing calculations, and financial monitoring, the system aims to make everyday business operations more organized and efficient.

By combining a modular React frontend, a Node.js and Express backend, a MySQL database, and six established software design patterns, the project demonstrates practical applications of full-stack development, software architecture, and object-oriented design principles.

The use of automated unit testing and structured GitHub collaboration further supports the development of a maintainable and reliable software solution.

---

**Developed as a Software Engineering project.**
