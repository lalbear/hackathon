# 🏥 NovaCare — Preventive Health & Wellness Portal

<div align="center">

![NovaCare Banner](https://img.shields.io/badge/NovaCare-Healthcare%20Portal-0d9488?style=for-the-badge&logo=heart&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live-Demo-0d9488?style=for-the-badge&logo=vercel&logoColor=white)](https://hackathon-git-main-pranjal-upadhyays-projects.vercel.app/)

**A full-stack healthcare wellness platform built for preventive care — featuring real-time reminders, wellness tracking, and public health intelligence.**

[🚀 Live Demo](https://hackathon-git-main-pranjal-upadhyays-projects.vercel.app/) • [Features](#features) • [Setup](#local-setup)

</div>

---

## 🌐 Live Deployment

You can access the deployed NovaCare application here:

🔗 **Frontend (Vercel):**  
https://hackathon-git-main-pranjal-upadhyays-projects.vercel.app/

> Backend APIs are connected through environment variables and hosted separately.

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
| Deployment | Docker (multi-stage build), Vercel |

---

## 🗂 Project Structure
