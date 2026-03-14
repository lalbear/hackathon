# 🏥 NovaCare — Preventive Health & Wellness Portal

<div align="center">

![NovaCare Banner](https://img.shields.io/badge/NovaCare-Healthcare%20Portal-0d9488?style=for-the-badge&logo=heart&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**A full-stack healthcare wellness platform built for preventive care — featuring real-time reminders, wellness tracking, and public health intelligence.**

[Live Demo](#deployment) • [Features](#features) • [Setup](#local-setup)

</div>

---

## ✨ Features

### 👤 For Patients
- **Secure Authentication** — JWT-based login & signup with bcrypt password hashing
- **Wellness Dashboard** — Daily tracking for steps, water intake, and sleep hours
- **Custom Wellness Targets** — Set personal goals (steps, water, sleep) that update progress cards dynamically
- **Progress Charts** — Area and Bar chart toggle for activity history (Recharts)
- **Reminders System** — Create reminders with 8 health categories (Medicine 💊, Water 💧, Exercise 🏃, Checkup 🩺, Vaccination 💉, Sleep 😴, Nutrition 🥗, General 🔔)
- **Smart Reminder Popups** — Fullscreen animated modal popup fires on **every page** when reminder due date + time is reached (5-minute lookback window handles page reloads)
- **Bell Icon Badge** — Navbar shows urgent reminder count with an interactive dropdown panel
- **Browser Notifications** — Native OS-level notification when reminder time matches (if permission granted)
- **Hydration Reminder** — In-app toast notification fires every 60 seconds if no water logged for the day

### 👨‍⚕️ For Providers
- **Provider Dashboard** — Personalized header with patient list and compliance metrics
- **New Patient Recommendations** — See newly registered patients to connect with

### 🌍 Public Health Intelligence
- **Mock WHO/CDC RSS Feed** — Health advisories with sentiment analysis badges (Positive / Negative / Neutral)
- **Rotating Health Tips** — 5 evidence-based tips cycling every 30 seconds with a smooth `AnimatePresence` fade+slide animation and dot navigation
- **Tip Categories** — Neuroplasticity, Sleep, Hydration, Zone 2 Cardio, Morning Sunlight

### 🔐 Account Management
- **Forgot Password** — Recovery flow with a demo-mode disclaimer
- **Show/Hide Password** — Eye icon toggle on the login form
- **Profile Update** — Edit name, email, and bio
- **Delete Account** — Permanently remove account and all data (`DELETE /api/profile`)

---

## 🛠 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Animation  | Framer Motion (AnimatePresence, motion.div) |
| Charts     | Recharts (AreaChart, BarChart) |
| Backend    | Node.js, Express 5, TypeScript |
| Database   | MongoDB with Mongoose ODM |
| Auth       | JWT (jsonwebtoken) + bcryptjs |
| Security   | Helmet.js (HTTP security headers) |
| HTTP Client| Axios |
| Icons      | Lucide React |
| Testing    | Jest + ts-jest + Supertest |
| Deployment | Docker (multi-stage build) |

---

## 🗂 Project Structure

```
preventive-care-portal/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # authController, goalController, reminderController, profileController
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # User, Goal, Reminder, Profile (Mongoose schemas)
│   ├── routes/          # authRoutes, goalRoutes, reminderRoutes, providerRoutes, profileRoutes
│   ├── tests/           # Jest unit tests
│   ├── types/           # Express type extensions
│   ├── server.ts        # Entry point
│   └── .env             # Environment variables (not committed)
├── frontend/
│   ├── app/
│   │   ├── dashboard/   # Patient dashboard
│   │   ├── provider/    # Provider dashboard
│   │   ├── reminders/   # Reminders management page
│   │   ├── profile/     # User profile page
│   │   ├── public-health/ # Health insights page
│   │   ├── login/       # Auth with forgot password + eye icon
│   │   └── signup/      # Registration
│   ├── components/
│   │   ├── Navbar.tsx   # Global nav with bell icon + reminder popup
│   │   ├── GoalCard.tsx # Wellness metric card
│   │   ├── PatientCard.tsx
│   │   └── ProgressChart.tsx
│   └── public/
├── Dockerfile           # Multi-stage Docker build
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com) — free tier)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/preventive-care-portal.git
cd preventive-care-portal
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/novacare
JWT_SECRET=your_super_secret_key_here
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

> Frontend runs on **http://localhost:3005**  
> Backend runs on **http://localhost:5000**

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Tests are powered by **Jest + ts-jest + Supertest** and cover the health check endpoint.

---

## 🚀 Deployment Guide

### Option 1: Vercel (Frontend) + Railway (Backend) — Recommended Free Tier

#### Deploy Frontend → Vercel
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL (e.g. `https://novacare-backend.up.railway.app`)
5. Click **Deploy** ✅

> **Important:** Update all `http://localhost:5000` in the frontend to `process.env.NEXT_PUBLIC_API_URL` before production deploy.

#### Deploy Backend → Railway
1. Go to [railway.app](https://railway.app) → **New Project** → Deploy from GitHub
2. Set **Root Directory** to `backend`
3. Add environment variables:
   - `PORT` = `5000`
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a strong random secret
4. Railway auto-detects Node and deploys ✅

---

### Option 2: Docker (Full-stack Self-hosted)

A multi-stage `Dockerfile` is included at the project root.

```bash
# Build the image
docker build -t novacare .

# Run the container
docker run -p 5000:5000 \
  -e MONGO_URI="mongodb+srv://..." \
  -e JWT_SECRET="your_secret" \
  novacare
```

Then deploy to:
- **Google Cloud Run** (free tier)
- **AWS ECS / App Runner**
- **DigitalOcean App Platform**
- **Fly.io** (free hobby tier)

---

### Option 3: Render.com (Easiest Free Tier)

1. Push to GitHub
2. Go to [render.com](https://render.com) → **New Web Service** → Connect Repo
3. Backend: Root Dir = `backend`, Build = `npm install && npm run build`, Start = `node dist/server.js`
4. Frontend: Root Dir = `frontend`, Build = `npm install && npm run build`, Start = `npm start`
5. Add env vars as shown above

---

## 🔐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login, returns JWT | ❌ |
| GET | `/api/profile` | Get profile | ✅ |
| PUT | `/api/profile` | Update profile | ✅ |
| DELETE | `/api/profile` | Delete account | ✅ |
| GET | `/api/goals` | Get wellness goals | ✅ |
| POST | `/api/goals` | Log activity | ✅ |
| GET | `/api/reminders` | Get all reminders | ✅ |
| POST | `/api/reminders` | Create reminder | ✅ |
| PUT | `/api/reminders/:id/complete` | Mark done | ✅ |
| DELETE | `/api/reminders/:id` | Delete reminder | ✅ |
| GET | `/api/health` | Health check | ❌ |

---

## 🌟 Hackathon Highlights

- ✅ Full JWT authentication (register → login → protected routes)
- ✅ Role-based routing (Patient / Provider)
- ✅ Real-time wellness tracking with customizable targets
- ✅ **Browser + In-app reminder notifications** with timezone-aware scheduling
- ✅ **Global reminder popup** fires on every page at due date+time
- ✅ Animated rotating health tips (5 tips, 30s interval)
- ✅ Sentiment-analyzed WHO/CDC news feed
- ✅ HTTP security headers via Helmet.js (HIPAA-aware)
- ✅ Automated Jest tests for CI/CD
- ✅ Multi-stage Dockerfile for deployment readiness
- ✅ Account deletion feature (GDPR-aware)

---

## 📄 License

MIT © 2026 NovaCare Team

---

<div align="center">
Built with ❤️ for better preventive healthcare.
</div>
