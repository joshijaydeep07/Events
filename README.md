# 🎓 UniEvents — College Event Registration System
### Local Prototype | Google Cloud Digital Leader Capstone Project

---

## 📋 Stack
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Backend:** Node.js + Express.js REST API
- **Database:** PostgreSQL (local)

---

## ⚙️ Prerequisites

| Tool | Version | Download |
|------|---------|---------|
| Node.js | v18+ | https://nodejs.org |
| PostgreSQL | v14+ | https://www.postgresql.org/download/ |
| npm | (comes with Node) | — |

---

## 🚀 Setup & Run

### Step 1 — Set your PostgreSQL credentials

Open `server.js` and update the `DB_CONFIG` block (~line 14):
```js
const DB_CONFIG = {
  host:     'localhost',
  port:     5432,
  user:     'postgres',        // your PostgreSQL username
  password: 'YOUR_PASSWORD',   // ← your password here
};
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Start the server
```bash
npm start
```

Expected output:
```
✅ Created database: unievents
✅ Table ready.
🚀 UniEvents running at http://localhost:3000
   Database: PostgreSQL
```

> The server **auto-creates** the `unievents` database and `registrations` table!

### Step 4 — Open the app
```
http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Submit a new registration |
| GET | `/api/registrations` | Get all registrations |
| GET | `/api/registrations/:id` | Get single registration |
| GET | `/api/health` | Server health check |

---

## 🗄️ Database Schema — `registrations` table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL (PK) | Auto-increment primary key |
| full_name | VARCHAR(150) | Student's full name |
| student_id | VARCHAR(50) | University student ID |
| email | VARCHAR(200) | Email address |
| event_name | VARCHAR(150) | Selected event |
| department | VARCHAR(100) | Student's department |
| phone | VARCHAR(20) | Phone number |
| notes | TEXT | Optional notes |
| created_at | TIMESTAMP | Auto-filled on insert |

---

## ☁️ Migration to Google Cloud

| Local Component | Google Cloud Equivalent | Why |
|----------------|------------------------|-----|
| Node.js on laptop | **Cloud Run** | Serverless containers, auto-scaling |
| PostgreSQL (local) | **Cloud SQL (PostgreSQL)** | Managed PostgreSQL, automated backups |
| `public/` static files | **Firebase Hosting** | Global CDN, free HTTPS |
| REST API | **Cloud Endpoints / API Gateway** | Managed API layer |
| Future notifications | **Pub/Sub** | Loose coupling for emails/SMS |
| Future auth | **Firebase Authentication** | Serverless sign-in |

### Changes Needed for Cloud Migration:
1. Update `DB_CONFIG` to use Cloud SQL connection string / socket
2. Add `Dockerfile` and deploy to Cloud Run via `gcloud run deploy`
3. Upload `public/` to Firebase Hosting (`firebase deploy`)
4. Store credentials in **Secret Manager** instead of hardcoding

---

## 🏗️ Project Structure
```
event-registration/
├── server.js       ← Express backend + PostgreSQL logic
├── package.json    ← Node.js dependencies  
├── setup.sql       ← Optional manual DB setup
├── README.md       ← This file
└── public/
    └── index.html  ← Frontend (HTML + CSS + JS)
```

*Capstone Project — Google Cloud Digital Leader Course*
