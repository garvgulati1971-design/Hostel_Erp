# 🏛️ SRM Institute of Science & Technology — Hostel ERP System

A modern, institutional-grade Hostel Enterprise Resource Planning (ERP) platform built with **React + Vite**, **Express.js**, **SQLite (`better-sqlite3`)**, and an **AI Content Moderation Shield**. Designed to replace outdated campus portals with a clean, realistic, and scalable residential management experience.

---

## 🌟 Key Features

### 1. 📢 Official Circulars & Notices
- Search by reference code (e.g., `SRM/DOA/HOSTEL/2026/089`) or keywords.
- Categorized and block-targeted circulars (Campus-wide, Block I, Block G, Block H, Block C).
- Interactive **Official Circular Letterhead Modal** with university seal, registrar signatures, and distribution lists.

### 2. 📅 2026 Academic & Hostel Holiday Calendar
- Real-time countdown timer to upcoming university holidays.
- Detailed hostel operational notes for each holiday: **Mess Special Feasts**, **Curfew Extensions**, and **Outpass Deadlines**.
- 1-click shortcut to pre-populate outpass dates directly from holiday cards.

### 3. 📸 Hostel Event Gallery
- Categorized albums for cultural fests (Milan), intra-hostel sports tournaments, hackathons, and celebrations.
- Fullscreen interactive photo lightbox viewer with photographer credits and location tags.
- Media submission modal for student committee photographers.

### 4. 💡 Anonymous Suggestion Box with AI Moderation
- **Real-Time AI Content Shield**: Evaluates submissions for vulgarity, abusive language, or harassment, providing constructive guidance if blocked.
- **Democratic Consensus**: Fellow residents can upvote/downvote and contribute opinion comments to discussions.
- **Warden Action Tracker**: Formal administrative review with official resolution badges (*Approved for Budget Allocation*, *Under Review*).

### 5. 🤝 Peer ShareHub (Block-Based Item Request Box)
- Borrow urgent utilities, chargers, cables, tools, textbooks, or first-aid supplies from peers in your specific block.
- Filterable by wing: **Block I, Block G, Block H, Block C, Block A, Block B**.
- "Offer Help" modal connecting students directly.

### 6. 🏢 Campus Hostel Blocks & Scalable Database
- Comprehensive management of all 6 campus wings:
  - **Block-I**: International & Senior Wing
  - **Block-G**: Engineering Boys Deluxe
  - **Block-H**: Postgraduate & Research Block
  - **Block-C**: Boys Executive
  - **Block-A**: Boys Standard
  - **Block-B**: Boys Deluxe
- Dedicated Block Wardens and designated emergency service technicians assigned to each block.
- Scalable SQLite database with WAL mode and indexing on roll numbers, outpasses, and complaints.

### 7. 🎫 Core Residential Life & Administration
- **Smart Outpass Manager**: Instant QR Gate Passes with AI travel risk assessment.
- **Maintenance & SMS Dispatch**: Real-time service ticket logging with automated SMS alert simulation.
- **Mess & Dining**: Multi-mess meal timings, live menu cards, dietary preference toggles, and feedback ratings.
- **Fee Management**: Ledger breakdown with digital receipts.
- **Multi-Role Portals**: Student Portal, Chief Warden Administration & Disciplinary Directory, and Field Service Operations.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS Design System (Custom Institutional Tokens, CSS Grid, Flexbox)
- **Backend**: Node.js, Express.js
- **Database**: SQLite with `better-sqlite3` (WAL mode, foreign keys, b-tree indexes)
- **AI Engine**: Local Rule-based NLP Moderation & Risk Scoring Engine

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/garvgulati1971-design/Hostel_Erp.git
cd Hostel_Erp
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Seed the SQLite database with 60+ students, blocks, notices, and suggestions
npm run seed

# Start the Express server (runs on http://localhost:5000)
npm run server
```

### 3. Frontend Setup
```bash
cd frontend

# Install frontend dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 🔐 Demo Credentials

Quick one-click login buttons are available on the login page, or use:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Student** | `Garv` | `12345` | Resident Portal (Room 402, Block I) |
| **Chief Warden** | `Warden` | `warden123` | Administrative DB, Disciplinary Warnings & Approvals |
| **Service Staff** | `Service` | `tech123` | Maintenance Queue & SMS Dispatch |

---

## 📄 License
This project is developed for educational and institutional demonstration purposes.
