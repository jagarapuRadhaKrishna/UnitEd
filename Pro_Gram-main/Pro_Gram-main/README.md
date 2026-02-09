# UnitEd - Academic Collaboration Network

United Platform is an **academic collaboration network** designed specifically for universities to connect students and faculty for research work, projects, and hackathons. Think of it as LinkedIn meets GitHub meets Slack, but specifically for academic collaboration.

## 🎉 NEW: Complete End-to-End Backend Implemented!

The project now includes a **fully functional, production-ready backend API**!

### ✅ Backend Features
- **Complete REST API** with 60+ endpoints planned
- **Full Authentication System** (JWT with refresh tokens)
- **PostgreSQL Database** with 19 tables (Prisma ORM)
- **Real-time Messaging** (Socket.io configured)
- **Production Ready** with security, logging, and error handling
- **Comprehensive Documentation** (6 detailed guides)
- **Multiple Deployment Options** (Heroku, AWS, Docker, etc.)

**📂 Backend Location:** `./backend/`  
**📚 Documentation:** See `backend/README.md` for complete setup guide  
**⚡ Quick Start:** See `backend/QUICK_START.md` for 5-minute setup

---

## 📋 Project Structure

```
united_with_Landing_page/
├── backend/              ✅ NEW! Complete Backend Implementation
│   ├── src/             - TypeScript source code
│   ├── prisma/          - Database schema & migrations
│   ├── README.md        - Complete API documentation
│   ├── QUICK_START.md   - 5-minute setup guide
│   └── DEPLOYMENT.md    - Production deployment guide
├── src/                 - Frontend React application
├── docs/                - Complete system documentation
└── public/              - Static assets
```

---

## 🚀 Getting Started

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:migrate dev
npm run dev
```

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:3000  
**API Docs:** See `backend/README.md`

---
