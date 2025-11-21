## Visualization Dashboard — README ##
- Overview

This project is a full-stack Data Visualization Dashboard built using:

- React (Vite) — Frontend
- Node.js + Express — Backend API
- MongoDB Atlas — Database
- D3.js — Custom charts
- Axios — API communication

It visualizes insights from the dataset such as:

1. Topic distribution
2. Intensity by country
3. Yearly trends
4. Intensity vs likelihood scatter plot
5. Filter-based record table
6. KPI summary (total records, avg intensity, top topic, top sector, etc.)

##  Project Structure ##
/dashboard-app
  ├── frontend/
  │     ├── src/
  │     │     ├── charts/
  |     |          └── 
  │     │     ├── components/
  │     │     ├── services/
  │     │     ├── App.jsx
  │     │     ├── index.css
  │     ├── vite.config.js
  │     ├── package.json
  │
  ├── backend/
  │     ├── models/
  │     │     └── Record.js
  │     ├──scripts/
  │     │     └── clean_import.js
  │     ├── server.js
  │     ├── package.json
  │     ├── .env
  │
  └── README.md

  ## Backend Setup ##
   1. Install dependencies
   * cd backend
   * npm install

  2. Configure .env
    - Create .env file inside backend folder:
    MONGO=your_atlas_connection_string
    FRONTEND_ORIGINS=http://localhost:5173
    MAX_LIMIT=2000

  3. Import JSON data
     node clean_import.js

  4. Start backend
     npm start

Backend runs on:
http://localhost:5000

   ## Frontend Setup ##
   1. Install dependencies
      cd frontend
      npm install

   2. Start frontend
      npm run dev

Frontend runs on:
http://localhost:5173

## Features ##
✔ KPI Summary

Shows:
- Total records
- Total countries
- Average intensity
- Top topic
- Top sector

✔ Filters
- Filter by:
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

✔ Visualizations
1. All charts built with D3.js:
2. Bar chart — Topic distribution
3. Horizontal bar — Intensity by country
4. Line chart — Trends by year
5. Scatter plot — Intensity vs likelihood

✔ Paginated Table
Shows first 50 filtered records.

## How to Run Full App ##

Start MongoDB Atlas
Run backend → npm start
Run frontend → npm run dev

Open: http://localhost:5173

Everything loads automatically.