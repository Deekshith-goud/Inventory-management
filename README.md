# Smart Inventory Intelligence System (SIIS)

A production-grade, full-stack inventory management system built with the modern web stack. SIIS combines standard CRUD capabilities with a high-end SaaS dashboard, highlighting smart predictive insights like demand sensing, stock health, and trend visualization.

## Features Built
- **Glassmorphic UI**: High-end SaaS asthetic combining dark mode (deep slate `#0f172a`) and light mode via TailwindCSS.
- **Intelligent Engine**: Dynamically calculates "Demand Score", "Stock Health", and alerts for "High Demand + Low Stock".
- **Dashboard Hub**: Recharts integration showing Category distribution, Trend lines, Stock Pie charts, and a Scatter Plot of Demand vs Stock.
- **Real-Time Activity Log**: Centralized logging every time products are created, updated, or deleted. 
- **Product Management**: Robust data tables with pagination, debounced search placeholders, filters, and a responsive Add/Edit modal dialog.
- **CSV Export**: Fully implemented backend export to download inventory.

## Technology Stack
- **Frontend**: React (Vite), TailwindCSS v3 (Base theme tokens), Framer Motion, Zustand (Global Theme/Sidebar state), React Query (Data Fetching Cache), React-Hot-Toast (Notifications), Recharts (Data Viz)
- **Backend**: Node.js, Express.js, Mongoose, dotenv, cors, json2csv.
- **Database**: MongoDB (Local or Cloud via MONGO_URI).

## Quick Setup Instructions

Make sure MongoDB is running locally on port `27017`, or adjust the `.env` inside `server/`.

### 1. Backend
```bash
cd server
npm install
npm run dev # Or simply: node index.js
```
*Note: A seeder file was created. To instantly generate dummy intelligence data to view the dashboard properly, run `node seeder.js` once inside `/server`.*

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

Navigate to `http://localhost:5173/` in your browser. The app defaults to Dark Mode. Focus the top-right slider icon (Sun/Moon) to switch themes, or use the Sidebar toggle to collapse navigation!

## Architecture Explanation
The application perfectly adheres to the MVC layered backend logic and headless UI composition:
- `server/models` holds strict Mongoose schemas defining our rules (e.g. positive prices).
- `server/services` holds abstract intelligence (the Intelligence Engine isolating demand/stock health equations).
- `server/controllers` parses Express variables and hooks into Models and Services.
- `client/src/store` manages shared global UI pieces without prop drilling.
- `client/src/pages` mounts distinct views.
