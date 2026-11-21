# 🎓 Sapthagiri NPS University (SNPSU) Campus Portal & Attendance System

[![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Google AI Studio](https://img.shields.io/badge/Google%20AI%20Studio-Gemini%202.0-8E75C2.svg?style=flat&logo=google)](https://aistudio.google.com)

A mobile-first, enterprise-grade University ERP and Academic Attendance Portal purpose-built for **Sapthagiri NPS University (SNPSU), Bengaluru**. Designed specifically for higher education academic structures across SNPSU's multidisciplinary schools.

---

## 🏛️ Supported SNPSU Schools & Programs

- **School of Engineering & Technology (SOET)**: B.Tech (CSE, AI & DS, Cyber Security, ECE, Mechanical, Civil)
- **School of Medicine & Allied Health Sciences (SIMS & RC - Sapthagiri Hospital)**: MBBS, B.Sc Nursing, Physiotherapy, Clinical Ward Postings
- **School of Management Studies (SOMS)**: MBA, BBA
- **School of Applied Sciences (SOAS)**: BCA, B.Sc Data Science & Biotechnology

---

## ⚡ Core University-Specific Features

1. **Choice Based Credit System (CBCS) & Period Engine**:
   - Supports 1-period theory lectures (1 hr = 1 credit).
   - Supports 2-period lab blocks (2-hr block = 2 periods count).
   - Supports 3-period clinical postings (MBBS hospital wards).
2. **Fast USN Roster Marking**:
   - High-contrast visual toggles: **[P] Present**, **[A] Absent**, **[L] Late**, **[OD] On-Duty**.
   - Quick-search filter by **last 3 digits of USN** (e.g., `003` or `012`).
   - Lab batch partitioning (`ALL`, `B1`, `B2`, `Clinical Group A`).
   - One-tap `Mark All Present` bulk acceleration.
3. **UGC / AICTE / NMC Statutory Condonation & Shortage Tracker**:
   - **>= 75%**: Fully Exam Eligible (Green).
   - **65%–74%**: Condonation Window (Orange) requiring Medical/OD approval from Dean/VC.
   - **< 65%**: Strictly Detained (Red) from Semester End Examinations (SEE).
4. **Student Bunk & Recovery Calculator**:
   - Real-time indicator of *"Safe Bunks Remaining"* or *"Classes Needed to reach 75%"*.
5. **Geo-Fenced Campus Punch-In**:
   - GPS perimeter check around the **Chikkasandra, Hesarghatta Main Road Campus** (13.0645° N, 77.5028° E) within 300m radius.
6. **Offline-First Classroom Sync**:
   - Fault-tolerant local queuing for basement laboratories and hospital wards with low network connectivity.
7. **Google AI Studio (Gemini 2.0 Flash) Copilot**:
   - AI assistant for attendance forecasting, condonation analysis, and document validation.

---

## 🚀 Quick Start (Run Locally in 60 Seconds)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the App
- **Web Browser (Fastest Preview)**:
  ```bash
  npm run web
  ```
- **Mobile Device (Expo Go)**:
  ```bash
  npm start
  ```
  *Scan the generated QR code using the Expo Go app on iOS or Android.*

---

## 🐙 Step-by-Step GitHub Upload Guide

To upload this complete application to your GitHub account:

### Step 1: Open Terminal in the project directory
```bash
cd "C:\Users\Moulya\.gemini\antigravity\scratch\snpsu-campus-portal"
```

### Step 2: Initialize Git and Commit
```bash
git init
git add .
git commit -m "feat: initial commit for Sapthagiri NPS University Attendance Portal"
```

### Step 3: Create a New Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new)
2. Enter repository name: `snpsu-campus-portal`
3. Leave it Public or Private, and do **not** initialize with README (we already created one).
4. Click **Create repository**.

### Step 4: Link and Push
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/snpsu-campus-portal.git
git push -u origin main
```

---

## 🤖 Google AI Studio & Cloud Deployment Guide

### Setting Up Google AI Studio (Gemini API)
1. Visit **[Google AI Studio](https://aistudio.google.com/)**.
2. Sign in with your Google Account and click **"Get API key"**.
3. Create an API key in a new or existing Google Cloud Project.
4. Copy your key and either:
   - Paste it directly into the **AI Advisor tab** inside the mobile app.
   - Or create a `.env` file in the project root:
     ```env
     EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyYourActualKeyHere
     ```
5. Restart your app with `npx expo start -c` to load the new environment variable.

### Deploying the Mobile Web App to Vercel / Firebase Hosting
1. Build the web export:
   ```bash
   npx expo export -p web
   ```
2. Deploy the generated `dist` folder:
   - **Vercel**: Run `npx vercel deploy` or connect your GitHub repository directly to Vercel.
   - **Firebase Hosting**:
     ```bash
     npm install -g firebase-tools
     firebase login
     firebase init hosting
     firebase deploy
     ```

---

## 📁 Project Architecture

```
snpsu-campus-portal/
├── src/
│   ├── types/
│   │   └── index.ts                 # Full SNPSU domain models & schemas
│   ├── theme/
│   │   └── colors.ts                # Deep navy, gold, and maroon palette
│   ├── data/
│   │   └── mockData.ts              # Authentic SNPSU USN rosters & slots
│   ├── services/
│   │   ├── geminiService.ts         # Google AI Studio Gemini integration
│   │   └── offlineSyncService.ts    # Basement lab offline queue engine
│   ├── components/
│   │   ├── Header.tsx               # SNPSU institutional crest header
│   │   ├── AttendanceRow.tsx        # High-speed USN 1-tap toggle row
│   │   └── GeoFenceCard.tsx         # Chikkasandra GPS Punch-In card
│   └── screens/
│       ├── FacultyAttendanceScreen.tsx # Production period marking screen
│       ├── FacultyDashboardScreen.tsx  # Timetable & OD request reviews
│       ├── StudentPortalScreen.tsx     # USN attendance & bunk calculator
│       ├── DeanShortageScreen.tsx      # UGC/AICTE statutory shortage report
│       └── AIAssistantScreen.tsx       # Interactive Gemini academic copilot
├── App.tsx                          # Role-based master navigation
├── firestore.rules                  # Production Firebase security rules
├── supabase_schema.sql              # Production PostgreSQL RLS schema
└── .env.example                     # Environment configuration template
```

---

## 🛡️ License & Copyright
Developed for **Sapthagiri NPS University (SNPSU), Bengaluru**.
Licensed under the Apache 2.0 License.
