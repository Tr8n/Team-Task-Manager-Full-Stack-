  Team Task Manager

A full-stack team task management app with authentication, RBAC, project management, task tracking, and dashboards.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT (role-based access: `ADMIN`, `MEMBER`)

## Features

- User signup/login with JWT authentication
- Role-based authorization (Admin and Member)
- Create and manage projects
- Create tasks with assignment and due date
- Task status workflow: `TODO`, `IN_PROGRESS`, `DONE`
- Member dashboard (personal overview)
- Admin dashboard (system-wide overview)
- Theme toggle and modern minimal UI

## Project Structure

```text
LinkUp/
  backend/
    controllers/
    models/
    routes/
    middleware/
    connection/
  frontend/
    src/
      components/
      services/
```

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB running locally or a remote MongoDB URI
- npm

## Environment Variables

Create `backend/.env` from `backend/.env.example` and configure:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d

ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@linkup.local
ADMIN_PASSWORD=Admin@123
```

## Default Admin Credentials

On backend start, the app auto-creates a default admin (if not already present):

- Email: `admin@linkup.local`
- Password: `Admin@123`

You can override these with env vars in `backend/.env`.

## Installation

### 1) Install backend dependencies

```bash
cd backend
npm install
```

### 2) Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Run Locally

### Backend

```bash
cd backend
npm run dev
```

Backend runs at: `http://localhost:5000`

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Build Frontend

```bash
cd frontend
npm run build
```

## API Overview

Base URL: `http://localhost:5000/api`

- Auth
  - `POST /auth/signup`
  - `POST /auth/login`
- Users
  - `GET /users` (authenticated)
- Projects
  - `POST /projects` (authenticated)
  - `GET /projects` (authenticated)
  - `PATCH /projects/:id/members` (authenticated)
- Tasks
  - `POST /tasks` (authenticated)
  - `GET /tasks` (authenticated)
  - `PATCH /tasks/:id/status` (authenticated)
- Dashboard
  - `GET /dashboard` (authenticated)
  - `GET /dashboard/admin` (admin only)

## Usage Notes

- Admin users are routed to the Admin Dashboard on login.
- Members are routed to the main task workspace.
- While creating a task, you can select `+ Add New Project` to create a project inline.

## Scripts

### Backend

- `npm run dev` - start backend with nodemon
- `npm start` - start backend with node

### Frontend

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build

## Security Notes

- Change `JWT_SECRET` before production deployment.
- Change default admin password in production.
- Do not commit real `.env` files to git.

## License

This project is for educational and internal development use.
