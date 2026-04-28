# AI Job Preparation Platform 🚀

An AI-powered full-stack platform that helps users analyze resumes, identify skill gaps, and prepare for job interviews using automated insights.

---

## 🌐 Overview

This platform enables users to upload resumes, compare them with job descriptions, and receive AI-driven feedback including skill gap analysis, ATS scoring, and interview preparation assistance.

---

## 🔗 Key Features

- 🔐 Secure user authentication (JWT-based login/register)
- 📄 Resume upload and parsing
- 🤖 AI-powered resume analysis using Google Gemini API
- 🎯 Job description matching for skill gap identification
- 🧩 Automated interview question generation
- 📊 ATS-style resume feedback system

---

## 🧠 Tech Stack

### Frontend
- React.js
- HTML, CSS

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB

### AI Integration
- Google Gemini API

---

## 🏗️ Architecture

Frontend (React)  
→ Backend (Express REST APIs)  
→ MongoDB (Data Storage)  
→ Gemini API (AI Processing)

---

## 📁 Project Structure
ai-job-prep-platform/
│
├── frontend/ # React frontend
├── backend/ # Express backend APIs
├── .gitignore
└── README.md



---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yashveer-1/ai-job-prep-platform.git
cd ai-job-prep-platform


2. Install dependencies
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

3. Run the application
Start backend
cd backend
npm start
Start frontend
cd ../frontend
npm run dev


