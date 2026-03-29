# 🚀 Remote Interview Platform

A full-stack, real-time interview platform that enables seamless collaboration between interviewers and candidates. Built to simulate real-world hiring workflows with scheduling, live video communication, and structured evaluation.

---

## 🌐 Live Demo  
👉 https://code-front-an-interview-platform.vercel.app/

---

## 📌 Overview

This platform allows interviewers to schedule and conduct interviews while candidates can join sessions, interact in real time, and showcase their skills. It supports multi-user video calls, screen sharing, and post-interview evaluation — all in a clean, modern UI.

---

## ✨ Features

### 🔐 Role-Based Authentication
- Secure authentication using **Clerk**
- Two roles:
  - **Interviewer**
  - **Candidate**

---

### 📅 Interview Scheduling
- Create and manage interview sessions
- Select multiple candidates
- Invite multiple interviewers (panel interviews)

---

### 🎥 Real-Time Communication
- Multi-user **video + audio calling**
- Low-latency real-time interaction
- Designed for scalability and smooth UX

#### Controls:
- 🎤 Mute / Unmute
- 📷 Camera On / Off  
- 🖥️ Screen Sharing

---

### 👥 Multi-Participant Support
- Multiple interviewers and candidates in a single session
- Enables panel interviews and group discussions

---

### 📼 Recording System
- Record interview sessions
- Playback available for interviewer review

---

### 📝 Evaluation & Feedback
- Mark candidates as:
  - ✅ Pass  
  - ❌ Fail  
- ⭐ Provide star ratings
- 💬 Add comments/feedback

---

## 🧠 Tech Stack

### Frontend
- **Next.js (App Router)**
- **Tailwind CSS**
- **shadcn/ui**
- **Framer Motion**

### Backend & Database
- **Convex (Real-time backend + database)**

### Authentication
- **Clerk**

---

## ⚙️ System Design Highlights

- Real-time state synchronization across multiple participants
- Event-driven architecture using Convex
- Scalable multi-user session handling
- Clean separation of concerns (UI, logic, backend)

---


## 🤝 Contributing

Pull requests and suggestions are welcome.

