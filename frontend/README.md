# Buzz Bizz — Frontend v1

A responsive business-management dashboard prototype built with React, TypeScript, Vite, Tailwind CSS v4, Motion for React, React Router, Recharts, and Lucide icons.

## Included screens
1. Login & registration (visual demo only; no real authentication)
2. Dashboard / Overview
3. Product Management
4. Inventory
5. Orders
6. Customers
7. Expenses & Payments
8. Pricing & Profit Calculator
9. Profile & Settings

Login and registration are not wired into this prototype yet. Open `/login` to view the login/registration screen, or `/` to view the dashboard. Forms and records use local demo state; no backend or database is connected.

## Requirements
- Node.js 22.12+ recommended (Vite 8 requires a modern Node release)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production build
```bash
npm run build
npm run preview
```

## Folder structure
```text
buzz-bizz-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.tsx       # Sidebar, topbar, responsive navigation
│   │   └── UI.tsx           # Shared buttons, cards, badges, headings
│   ├── data/
│   │   └── mockData.ts      # Temporary sample products and orders
│   ├── pages/
│   │   ├── Auth.tsx         # Login and registration UI
│   │   ├── Dashboard.tsx
│   │   └── Management.tsx   # Products, inventory, orders, customers,
│   │                        # finance, pricing, profile screens
│   ├── App.tsx              # Routes
│   ├── main.tsx             # React entry point
│   └── styles.css           # Theme, layout, responsive styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Design palette
- Matcha Mist: `#9DBF7C`
- Linden Leaf: `#C7DDAA`
- Sunny Citron: `#FFF2A6`
- Kiwi Cream: `#E6F0C3`
- Green Tea Latte: `#A7BC9A`

## Important next steps
- Replace demo arrays with API calls.
- Add real authentication and protected routes.
- Connect CRUD operations to the backend.
- Validate stock changes on the server, not only in the browser.
- Add unit tests and accessibility checks.
- Store secrets only in environment variables; never commit database credentials.
