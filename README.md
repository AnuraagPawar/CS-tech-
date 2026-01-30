# MERN Agent Distribution System

A production-ready MERN stack application for managing agents and equally distributing uploaded records (CSV/XLSX) among them.

## 🚀 Projects Overview

- **Admin Authentication**: Secure login for administrators.
- **Agent Management**: Complete CRUD for agents.
- **Fair Distribution**: Uploaded records are distributed equally among exactly 5 agents.
- **File Support**: Supports .csv, .xlsx, and .xls files.
- **Tech Stack**:
  - **Frontend**: React (Vite), Tailwind CSS, Axios, React Router.
  - **Backend**: Node.js, Express, MongoDB (Mongoose), JWT.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB Connection URI (Provided in config)

### 1. Installation

**Backend Setup**
```bash
cd server
npm install
```

**Frontend Setup**
```bash
cd client
npm install
```

### 2. Configuration & Seeding

The backend comes pre-configured with the required MongoDB URI in `.env`.

**Seed Admin User**
Run this command to create the initial Admin account:
```bash
cd server
npm run seed
```
*Output should confirm admin creation.*

### 3. Running the Application

**Start Backend**
```bash
cd server
npm run dev
```
*Server runs on http://localhost:5000*

**Start Frontend**
```bash
cd client
npm run dev
```
*Client runs on http://localhost:5173*

## 🔑 Usage Guide

1. **Login**
   - URL: `http://localhost:5173/login`
   - Email: `admin@example.com`
   - Password: `admin123`

2. **Manage Agents**
   - Go to "Agents" tab.
   - You MUST create **exactly 5 agents** before uploading files.
   - Use "Add Agent" to create them.

3. **Upload & Distribute**
   - Go to "Upload" tab.
   - Select a valid `.csv` or `.xlsx` file.
   - **Required Columns**: `FirstName`, `Phone`. `Notes` is optional.
   - Click "Upload & Distribute".
   - The system will split records equally.

4. **View Distributed Data**
   - Go back to "Agents" tab.
   - Click the **List/View** icon (Green) next to an agent to see their assigned leads.

## 📂 Project Structure

- `client/`: React Frontend
- `server/`: Node.js Backend
- `server/models`: Mongoose Schemas (User, Agent, Record)
- `server/controllers`: Business Logic
- `server/routes`: API Endpoints

## 🛡️ Security

- Passwords hashed with `bcryptjs`.
- JWT authentication for API routes.
- Backend validation for file types and agent count.

---
**Built for Internship Machine Test**
