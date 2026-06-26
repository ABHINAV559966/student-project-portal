# 🎓 Student Mini Project Management Portal

A modern, full-stack task management application designed for students to create, track, and manage their academic project tasks through a beautiful professional dashboard.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Animated statistics cards, donut chart, recent tasks, progress bars |
| ✅ **Task CRUD** | Create, Read, Update, Delete tasks with full validation |
| 🔍 **Real-time Search** | Search by title or description with 350ms debounce |
| 🎯 **Filters** | Filter by All / Pending / In Progress / Completed |
| 🔃 **Sorting** | Sort by Newest First or Oldest First |
| 🌙 **Dark Mode** | Toggle with `localStorage` persistence + system preference |
| 🔔 **Toast Notifications** | Success, error, and delete confirmations |
| 🗑️ **Confirm Dialog** | Delete confirmation before permanent removal |
| 📱 **Responsive** | Works on Desktop, Tablet, and Mobile |
| 🔒 **Validation** | Frontend + backend (express-validator) validation |
| 🔄 **Fallback DB** | Auto in-memory storage when MongoDB unavailable |
| 🎨 **Glassmorphism UI** | Premium SaaS-grade UI with animations |

---

## 🏗️ Project Structure

```
student-mini-project/
├── client/                    # React 19 + Vite + Tailwind CSS frontend
│   ├── public/
│   ├── src/
│   │   ├── api/               # Axios service layer
│   │   ├── components/        # Reusable UI components
│   │   │   ├── dashboard/     # StatCard
│   │   │   ├── layout/        # Sidebar, Navbar
│   │   │   ├── tasks/         # TaskCard, TaskForm, TaskModal, DeleteConfirm
│   │   │   └── ui/            # Spinner, EmptyState, SearchBar
│   │   ├── context/           # ThemeContext (dark mode)
│   │   ├── hooks/             # useTasks custom hook
│   │   ├── pages/             # Dashboard, Tasks, TaskDetail
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Node.js + Express + MongoDB backend
│   ├── config/                # Database connection
│   ├── controllers/           # Business logic
│   ├── middleware/            # Error handler, validation
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routers
│   ├── storage/               # In-memory fallback store
│   ├── server.js              # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (optional — app works without it)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/student-project-portal.git
cd student-project-portal
```

### 2. Setup Backend
```bash
cd server
npm install

# Copy the example env file
copy .env.example .env
# Edit .env and add your MongoDB URI (optional)
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

### 4. Run Both Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App starts at http://localhost:5173
```

---

## 🌍 Environment Variables

### Server (`server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB Atlas connection string | *(empty — uses in-memory)* |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

> **Note:** If `MONGODB_URI` is empty or invalid, the app automatically uses JavaScript in-memory storage seeded with sample tasks.

---

## 📡 REST API Documentation

**Base URL:** `http://localhost:5000/api`

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get all tasks (supports `?search=`, `?status=`, `?sortBy=`) |
| `GET` | `/tasks/:id` | Get single task by ID |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard/stats` | Get task statistics (total, pending, inProgress, completed) |

### Query Parameters for `GET /tasks`

| Param | Values | Description |
|-------|--------|-------------|
| `search` | `string` | Search title & description |
| `status` | `pending`, `in-progress`, `completed` | Filter by status |
| `sortBy` | `newest` (default), `oldest` | Sort order |

### Request Body for `POST /tasks`

```json
{
  "title": "My Task Title",
  "description": "Optional description",
  "status": "pending"
}
```

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Task created successfully"
}
```

---

## 🎨 Tech Stack

### Frontend
- **React 19** — UI library
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations & transitions
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client with interceptors
- **React Hot Toast** — Toast notifications
- **React Icons** — Icon library
- **Recharts** — Data visualization charts

### Backend
- **Node.js** — Runtime
- **Express.js** — Web framework
- **Mongoose** — MongoDB ODM
- **express-validator** — Input validation
- **Helmet** — Security headers
- **Morgan** — HTTP request logger
- **CORS** — Cross-origin resource sharing
- **dotenv** — Environment variables

### Database
- **MongoDB Atlas** (primary) — Cloud MongoDB
- **In-Memory Store** (fallback) — JS array-based CRUD

---

## 🌐 Deployment

### Backend — Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Set the following:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `CLIENT_URL` — your Vercel frontend URL
   - `NODE_ENV` — `production`

### Frontend — Vercel

1. Create a new project on [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Set the following:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` — your Render backend URL

5. Update `client/vite.config.js` proxy target to your Render URL for production, or use the `VITE_API_URL` env variable in `taskService.js`.

### MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Whitelist IP `0.0.0.0/0` (or specific IPs)
5. Get connection string from **Connect > Drivers**
6. Add to Render env variables as `MONGODB_URI`

---

## 📦 Git Commands

```bash
# Initialize repository
git init
git add .
git commit -m "feat: initial commit - Student Project Management Portal"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/student-project-portal.git
git branch -M main
git push -u origin main
```

---

## 🔮 Future Improvements

- [ ] User authentication (JWT + bcrypt)
- [ ] Task categories / tags
- [ ] Due dates with calendar view
- [ ] Priority levels (High / Medium / Low)
- [ ] File attachments per task
- [ ] Email notifications
- [ ] Collaboration / team sharing
- [ ] Export tasks to PDF / CSV
- [ ] Kanban board view
- [ ] Mobile PWA support

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">
  Built with ❤️ for students by students
</div>
