# mern-dashboard-visualization
A complete MERN stack analytics dashboard that visualizes structured data using interactive D3.js charts, API-driven filters, and real-time KPIs.

---

## Visualization Dashboard — README ##

### Overview
This project is a full-stack Data Visualization Dashboard built using:

- **React (Vite)** — Frontend  
- **Node.js + Express** — Backend API  
- **MongoDB Atlas** — Database  
- **D3.js** — Custom charts  
- **Axios** — API communication  

It visualizes insights from the dataset such as:

1. Topic distribution  
2. Intensity by country  
3. Yearly trends  
4. Intensity vs likelihood scatter plot  
5. Filter-based record table  
6. KPI summary (total records, avg intensity, top topic, top sector, etc.)

---

## Project Structure
/dashboard-app
├── frontend/
│ ├── src/
│ │ ├── charts/
│ │ ├── components/
│ │ ├── services/
│ │ ├── App.jsx
│ │ ├── index.css
│ ├── vite.config.js
│ ├── package.json
│
├── Backend/
│ ├── models/
│ │ └── Record.js
│ ├── scripts/
│ │ └── clean_import.js
│ ├── server.js
│ ├── package.json
│ ├── .env (ignored by git)
│
└── README.md

---

## Backend Setup

1. Install dependencies  
cd Backend
npm install


2. Configure `.env`  
Create `.env` inside **Backend** folder:

MONGO=your_atlas_connection_string
FRONTEND_ORIGINS=http://localhost:5173
MAX_LIMIT=2000

3. Import JSON data  
node scripts/clean_import.js


4. Start backend  
npm start

Backend runs on:  
**http://localhost:5000**

---
## Frontend Setup

1. Install dependencies
cd frontend
npm install


2. Start frontend  
npm run dev


Frontend runs on:  
**http://localhost:5173**

---

## Features

### ✔ KPI Summary  
Shows:
- Total records  
- Total countries  
- Average intensity  
- Top topic  
- Top sector  

### ✔ Filters  
Filter by:
- End year  
- Topic  
- Sector  
- Region  
- Pestle  
- Source  
- Published date  
- Country  
- Impact  

Filters update dashboard instantly.

### ✔ Visualizations (D3.js)
1. Bar chart — Topic distribution  
2. Horizontal bar — Intensity by country  
3. Line chart — Trends by year  
4. Scatter plot — Intensity vs likelihood  

### ✔ Paginated Table  
Shows first 50 filtered records.

---

## How to Run Full App

1. Connect MongoDB Atlas  
2. Start backend → `npm start`  
3. Start frontend → `npm run dev`  

Open in browser:  
**http://localhost:5173**

Everything loads automatically.
