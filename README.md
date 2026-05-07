================================================================================
                           TEAM TASK MANAGER
================================================================================

A full-stack collaborative project and task management platform built for teams 
to organize projects, assign tasks, and track progress efficiently.

--------------------------------------------------------------------------------
🚀 LIVE DEMO
--------------------------------------------------------------------------------
Frontend Web App:
https://dynamic-prosperity-production-3c18.up.railway.app

Backend API:
https://team-task-manager-production-e16f.up.railway.app/api/v1


--------------------------------------------------------------------------------
📌 PROJECT OVERVIEW
--------------------------------------------------------------------------------
Team Task Manager is a modern project collaboration platform where teams can:
 - Create and manage projects
 - Assign tasks to specific members
 - Track task progress in real-time
 - Manage team roles (Admin / Member)
 - Monitor dashboards for overall progress and overdue tasks
 - Collaborate securely using JWT authentication

The application uses a strict role-based access control (RBAC) system to ensure 
only authorized users can manage projects and tasks.


--------------------------------------------------------------------------------
✨ CORE FEATURES
--------------------------------------------------------------------------------
🔐 Authentication & Security:
 - Secure User Signup & Login
 - JWT-based authentication
 - Protected API routes
 - Password hashing
 - Environment variable protection

👥 Role-Based Access Control:
 [Admin]
  - Create and manage projects
  - Add/remove team members
  - Assign roles to members
  - Create and manage tasks
 [Member]
  - View assigned projects
  - Update the status of assigned tasks
  - Access analytics dashboards

📁 Project Management:
 - Create new projects
 - Edit or Delete projects
 - Manage project members
 - Track overall project progress

✅ Task Management:
 - Create tasks and assign them to team members
 - Update task status: [TODO] -> [IN_PROGRESS] -> [DONE]
 - Filter tasks easily
 - Track and highlight overdue tasks

📊 Dashboard:
 - Task analytics and metrics
 - Progress overview charts
 - Overdue task tracking
 - Project summaries


--------------------------------------------------------------------------------
🛠️ TECH STACK
--------------------------------------------------------------------------------
- Frontend: React.js, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL (Managed via 'pg' library)
- Deployment: Railway (Frontend, Backend, and Database)


--------------------------------------------------------------------------------
📂 PROJECT STRUCTURE
--------------------------------------------------------------------------------
Team-Task-Manager/
│
├── backend/
│   ├── src/
│   ├── scripts/
│   ├── package.json
│   └── railway.toml
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.txt


--------------------------------------------------------------------------------
🖥️ LOCAL SETUP INSTRUCTIONS
--------------------------------------------------------------------------------
1️⃣ Clone Repository:
    git clone https://github.com/Pragya80/Team-Task-Manager.git
    cd Team-Task-Manager

2️⃣ Backend Setup:
    cd backend
    npm install
    
    # Create a .env file based on the environment variables below
    npm run migrate
    npm start
    
    (Backend will run on http://localhost:3000)

3️⃣ Frontend Setup:
    cd frontend
    npm install
    npm run dev
    
    (Frontend will run on http://localhost:5173)


--------------------------------------------------------------------------------
⚙️ ENVIRONMENT VARIABLES
--------------------------------------------------------------------------------
[Backend .env]
PORT=3000
DATABASE_URL=your_postgresql_connection_url
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173

[Frontend .env]
VITE_API_URL=http://localhost:3000/api/v1


--------------------------------------------------------------------------------
📡 API ENDPOINTS
--------------------------------------------------------------------------------
[Authentication]
POST    /api/v1/auth/register                   Register user
POST    /api/v1/auth/login                      Login user

[Projects]
GET     /api/v1/projects                        Get projects
POST    /api/v1/projects                        Create project
GET     /api/v1/projects/:id                    Get project details
PUT     /api/v1/projects/:id                    Update project
DELETE  /api/v1/projects/:id                    Delete project

[Team Members]
GET     /api/v1/projects/:id/members            Get members
POST    /api/v1/projects/:id/members            Add member
PATCH   /api/v1/projects/:id/members/:userId/role Update role
DELETE  /api/v1/projects/:id/members/:userId    Remove member

[Tasks]
GET     /api/v1/projects/:id/tasks              Get tasks
POST    /api/v1/projects/:id/tasks              Create task
PUT     /api/v1/projects/:id/tasks/:taskId      Update task
PATCH   /api/v1/projects/:id/tasks/:taskId/status Update status
DELETE  /api/v1/projects/:id/tasks/:taskId      Delete task


--------------------------------------------------------------------------------
🚀 DEPLOYMENT FEATURES
--------------------------------------------------------------------------------
The application is deployed on Railway featuring:
 - Automatic redeploys on GitHub push
 - Centralized environment variable management
 - Public networking with generated domains
 - Automatic health checks (/api/v1/health)
 - Persistent PostgreSQL storage


--------------------------------------------------------------------------------
👩‍💻 AUTHOR
--------------------------------------------------------------------------------
Pragya Singh
GitHub Repository: https://github.com/Pragya80/Team-Task-Manager
================================================================================
