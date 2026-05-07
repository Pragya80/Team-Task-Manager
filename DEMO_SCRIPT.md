# VIDEO TITLE
Team Task Manager: Full Stack Architecture & Implementation Walkthrough

---

# PROJECT INTRODUCTION

## What to say:
"Hello everyone, I'm presenting 'Team Task Manager', a full-stack web application designed to solve team collaboration and project tracking bottlenecks. The problem we often see is that teams lose track of tasks, priorities, and deadlines across multiple projects. This application solves that by providing a centralized, role-based platform where users can manage projects, add team members, assign tasks, and monitor progress via a dynamic dashboard. 

For the tech stack, I chose a modern Javascript ecosystem. The frontend is built with React and Vite for high performance, styled using Tailwind CSS for rapid, responsive design. The backend is a robust Express.js REST API powered by Node.js. For the database, I chose PostgreSQL, opting to use raw SQL queries via the 'pg' library to ensure maximum performance and granular control over the data layer, without the overhead of an ORM. The entire application is designed to be easily deployable on platforms like Railway."

---

# VIDEO RECORDING SETUP GUIDE

Before you hit record, ensure your environment is prepared exactly like this:
- **IDE (VS Code):** Have the `Team Task Manager` folder open. Pre-open `backend/scripts/migrate.js`, `backend/src/controllers/projects.js`, and `frontend/src/App.jsx` in different tabs.
- **Terminal:** Open two split terminals in VS Code. One running `npm run dev` in the `backend` folder, and the other running `npm run dev` in the `frontend` folder. Ensure no errors are visible.
- **Browser:** Open Google Chrome (or your preferred browser) to `http://localhost:5173`. Keep a second tab open with the Railway.app dashboard (or just the `.env` file open to show config).
- **Recommended Flow:** Start in the browser showing the working app, move to VS Code to explain the backend architecture, transition to the frontend architecture, show the database schema, and end with the live demo.

---

# VIDEO FLOW TIMELINE

**Total Estimated Duration: 12:00 - 15:00 minutes**

- **00:00 - 01:30:** Introduction & Tech Stack Overview
- **01:30 - 04:00:** Backend Architecture & APIs
- **04:00 - 06:30:** Database Schema & Raw SQL Setup
- **06:30 - 09:00:** Frontend Architecture & State Management
- **09:00 - 13:00:** Live Demo (Signup to Task Completion)
- **13:00 - 14:30:** Deployment & Infrastructure
- **14:30 - 15:00:** Conclusion & Future Scope

---

# COMPLETE SPEAKING SCRIPT

## 1. BACKEND WALKTHROUGH

### What to open:
Open the VS Code explorer. Highlight the `backend/src` directory. Open `backend/src/server.js`, then `backend/src/routes/index.js`, and finally `backend/src/controllers/auth.js`.

### What to highlight on screen:
- In `server.js`: Highlight the database connection check (`pool.connect()`).
- In `routes/index.js`: Highlight the modular routing (`router.use('/projects', projectRoutes);`).
- In `controllers/auth.js`: Point to the `bcrypt.hash` logic and JWT generation.

### Camera/navigation instructions:
"Let's dive into the backend codebase in VS Code. First, I'll open `server.js`..."
*Scroll through `server.js` and `routes/index.js` slowly.*

### What to say:
"Our backend is structured using a modular, feature-based architecture in Express. If we look at `server.js`, you'll notice I specifically ensure the database connection is verified before the server even starts listening. This prevents silent failures in production. 

Moving to the routing layer in `routes/index.js`, I've implemented a clean RESTful structure. Routes are separated logically into auth, projects, tasks, and teams. Notice how tasks and team routes are nested under the `/projects/:id` scope. This enforces the relationship that tasks and members strictly belong to a specific project.

Let's look at authentication in `controllers/auth.js`. I'm using JWT (JSON Web Tokens) for stateless authentication. Passwords are securely hashed using `bcrypt` with 12 salt rounds. When a user logs in, the API returns a JWT which the frontend attaches to subsequent requests via an HTTP Bearer header."

### Important engineering explanation:
"I chose this middleware-based folder structure to enforce a strict separation of concerns. Controllers only handle request/response logic, while validations and error handling are extracted into dedicated middlewares like `errorHandler.js` and `validate.js`. This makes the codebase highly testable and maintainable."

---

## 2. DATABASE WALKTHROUGH

### What to open:
Open `backend/scripts/migrate.js`.

### What to highlight on screen:
- Highlight the `CREATE TABLE projects` and `CREATE TABLE project_members` blocks.
- Point out the `REFERENCES` and `ON DELETE CASCADE` constraints.
- Highlight the `CREATE INDEX` statements at the bottom.

### Camera/navigation instructions:
"Now, let's look at the database schema." *Open `migrate.js`.* "Scroll down slowly through the table definitions."

### What to say:
"For the database, I used PostgreSQL. Instead of using an ORM like Prisma or Sequelize, I decided to write raw SQL queries using the `pg` driver. You can see this in our `migrate.js` script. 

We have four core tables: `users`, `projects`, `project_members`, and `tasks`. 
To handle Role-Based Access Control (RBAC), I created the `project_members` junction table. It links a `user_id` to a `project_id` and includes a `role` column constrained to either 'admin' or 'member'.

Notice the strict foreign key constraints, like `ON DELETE CASCADE` for tasks when a project is deleted. This ensures absolute data integrity at the database level. I also added explicit database indexes on frequently queried columns, like `project_id` in tasks and `user_id` in the members table, to guarantee fast query performance as the application scales."

---

## 3. FRONTEND WALKTHROUGH

### What to open:
Open `frontend/src/App.jsx`. Then open `frontend/src/pages/ProjectsList.jsx`. 

### What to highlight on screen:
- In `App.jsx`: Highlight the `<PrivateRoute />` wrapper and `react-router-dom` setup.
- In `ProjectsList.jsx` (or a similar page): Highlight the useEffect hooks and API calls.

### Camera/navigation instructions:
"Let's switch to the frontend architecture." *Open `App.jsx`.* *Then open `ProjectsList.jsx`.*

### What to say:
"The frontend is built with React and Vite. In `App.jsx`, I'm using `react-router-dom` for client-side routing. You'll see I've wrapped all the core application routes inside a `<PrivateRoute />` component. This component intercepts the routing; if no valid JWT is found in local storage, it immediately redirects the user to the login page, protecting our application state.

Inside the pages, like `ProjectsList.jsx`, I'm utilizing functional components and hooks to manage local state. API calls are made using Axios, configured with interceptors to automatically attach the auth token to every outgoing request. The UI is built using Tailwind CSS, allowing me to build a highly responsive, modern, and accessible interface very rapidly without writing massive external CSS files."

---

## 4. LIVE DEMO FLOW

### What to open:
Switch to the Browser (Chrome) at `http://localhost:5173`. 

### Camera/navigation instructions & What to say:
*Action: Click Register*
"Now, let's look at the application in action. I'll start by registering a new user."

*Action: Fill out the registration form and submit. Then Login if not auto-logged in.*
"Once registered, I'm redirected to my main workspace. It's empty right now, so let's create a new project."

*Action: Click 'Create Project', name it "Website Redesign", and submit.*
"I've created 'Website Redesign'. As the creator, I'm automatically assigned the 'admin' role for this specific project. Let's enter the project."

*Action: Click into the project, navigate to the Team tab, and add a member by email.*
"Collaboration is key, so I'll go to the Team tab and invite my colleague. Because I'm an admin, the system authorizes me to add members. If I were just a 'member', the backend RBAC middleware would block this request."

*Action: Go to the Tasks board, create a task "Design Homepage", set priority to High, and assign it.*
"Now I'll create a task, set the priority, and assign it. The UI updates instantly."

*Action: Move the task to 'In Progress'.*
"I can update the task status to 'In Progress'. This hits our REST API, updates the Postgres database, and refreshes our view. Finally, the Dashboard provides a bird's-eye view of task distribution and overdue items, giving project managers instant insights."

---

## 5. DEPLOYMENT EXPLANATION

### What to open:
Open `backend/railway.toml` and `.env.example` in VS Code.

### What to highlight on screen:
- Highlight the `NIXPACKS` builder in `railway.toml`.
- Point out the `DATABASE_URL` and `JWT_SECRET` in the `.env` file.

### Camera/navigation instructions:
"Finally, let's talk about deployment." *Show the `railway.toml` file.*

### What to say:
"The application is production-ready. I configured the backend for deployment on Railway using this `railway.toml` file, which specifies the build and start commands, as well as a health check endpoint to ensure zero-downtime deployments. 

Environment variables are strictly managed. Secrets like the `JWT_SECRET`, database connection strings, and port configurations are kept securely in the environment, ensuring the codebase is safe to be open-sourced or shared."

---

# COMMON QUESTIONS & ANSWERS

**Q: Why did you choose to write raw SQL instead of using an ORM like Prisma?**
*Answer:* "While ORMs speed up initial development, I chose raw SQL using the `pg` driver to maintain absolute control over the queries. It removes the abstraction layer, making it easier to optimize complex joins and ensuring maximum performance. It also demonstrates a deep, fundamental understanding of relational databases."

**Q: How is Role-Based Access Control (RBAC) implemented securely?**
*Answer:* "Security happens at the backend. When a user accesses a project resource, a custom middleware checks their JWT to identify them, then queries the `project_members` junction table to verify their role for that *specific* project. If they attempt an admin action (like deleting a task) but only have a 'member' role, the API returns a 403 Forbidden."

**Q: How can this application scale in the future?**
*Answer:* "The modular backend means we could easily extract services into microservices if needed. At the database level, I've already added indexes to the most queried foreign keys. Next steps would include implementing Redis for caching project states, and adding pagination to the tasks API to handle thousands of records efficiently."

---

# VIDEO DELIVERY TIPS

- **Pacing:** Speak clearly and deliberately. Don't rush when explaining code. Let the viewer read the code you are highlighting.
- **Confidence:** Frame your choices as deliberate engineering decisions. Use phrases like "I chose to implement..." or "I designed this specifically to...".
- **Focus:** Spend 70% of your time on the architecture, security, and the database, and 30% on the frontend and UI demo. Interviewers care deeply about the backend structure and data integrity.
- **Mistakes:** If a minor glitch happens during the demo, don't panic. Acknowledge it briefly and move on, or simply pause the recording, fix it, and restart that segment. DO NOT apologize profusely; stay professional. 
