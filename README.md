# Team Task Manager

A full-stack, production-ready MVP for a team-based project management tool. Built without ORMs or microservices, focusing on raw SQL performance and a clean, responsive React frontend.

## Features

- **Authentication**: Secure JWT-based authentication using HTTP Bearer tokens and bcrypt password hashing.
- **Project Management**: Create projects and assign members with role-based access control (`admin` and `member`).
- **Task Tracking**: Create, assign, and manage tasks. Members can only update the status of tasks assigned to them, while admins have full control.
- **Advanced Filtering**: Filter tasks by status, assignee, or overdue state via dynamic SQL queries.
- **Dashboard Aggregations**: PostgreSQL-powered single-pass aggregations for high-performance dashboard statistics.
- **Rich UI**: Responsive, glassmorphism-inspired design using Tailwind CSS v4, Lucide React icons, and custom components.

## Tech Stack

**Backend**
- Node.js 20 LTS
- Express.js 4
- PostgreSQL 16 (Raw SQL via `pg` driver)
- JSON Web Tokens (jsonwebtoken) + bcrypt
- express-validator, morgan, cors

**Frontend**
- React 18
- Vite
- React Router v6
- Tailwind CSS v4
- Axios
- Lucide React (Icons)

## Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL (v16+ recommended)

## Setup Instructions

### 1. Database Initialization
1. Ensure PostgreSQL is running.
2. Create a new database: `CREATE DATABASE team_tasks;`
3. In the `/backend` directory, create a `.env` file with your connection string:
   ```env
   PORT=3000
   DATABASE_URL=postgres://user:password@localhost:5432/team_tasks
   JWT_SECRET=your_super_secret_key_change_me
   FRONTEND_URL=http://localhost:5173
   ```
4. Run the migration script to scaffold the database tables:
   ```bash
   cd backend
   npm run migrate
   ```

### 2. Running the Backend
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:3000`.

### 3. Running the Frontend
1. In the `/frontend` directory, create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```
2. Start the Vite development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
The frontend will be available at `http://localhost:5173`.

## API Endpoints Overview

### Auth
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Authenticate and receive a JWT

### Projects
- `GET /api/v1/projects` - Get all projects for the authenticated user
- `POST /api/v1/projects` - Create a new project
- `GET /api/v1/projects/:id` - Get project details and members [Requires Member]
- `PUT /api/v1/projects/:id` - Update project details [Requires Admin]
- `DELETE /api/v1/projects/:id` - Delete project (cascading) [Requires Admin]

### Team
- `GET /api/v1/projects/:id/members` - List project members [Requires Member]
- `POST /api/v1/projects/:id/members` - Add a user to the project [Requires Admin]
- `PATCH /api/v1/projects/:id/members/:userId/role` - Update member role [Requires Admin]
- `DELETE /api/v1/projects/:id/members/:userId` - Remove member [Requires Admin]

### Tasks
- `GET /api/v1/projects/:id/tasks` - List tasks with optional `status`, `assignee`, and `overdue` filters [Requires Member]
- `POST /api/v1/projects/:id/tasks` - Create a task [Requires Admin]
- `GET /api/v1/projects/:id/tasks/:taskId` - Get specific task [Requires Member]
- `PUT /api/v1/projects/:id/tasks/:taskId` - Update task details [Requires Admin]
- `PATCH /api/v1/projects/:id/tasks/:taskId/status` - Update task status [Requires Member/Assigned]
- `DELETE /api/v1/projects/:id/tasks/:taskId` - Delete task [Requires Admin]

### Dashboard
- `GET /api/v1/projects/:id/dashboard` - Get aggregated stats and overdue list [Requires Member]

## Deployment

The repository is configured for easy deployment:
- **Backend**: Contains a `railway.toml` optimized for deployment on Railway via the Nixpacks builder.
- **Frontend**: A static Vite build that can be easily connected to Vercel, Netlify, or Railway static hosting. Ensure `VITE_API_URL` is configured in the production environment.
