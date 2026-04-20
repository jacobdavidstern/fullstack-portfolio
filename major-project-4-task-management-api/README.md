# Task Management API

A secure REST API for managing personal tasks with user authentication, role‑based access, and MongoDB persistence

## Overview

This project is a backend‑only API built with Node.js, Express, JWT authentication, and MongoDB/Mongoose.
Users can register, log in, and manage their own tasks. Admin users have elevated permissions to view all tasks across the system.

This was built as Major Project 4 in my full‑stack bootcamp.

### Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- helmet, CORS, rate limiting for security
- dotenv for environment configuration

### Features

#### Core Features (Required)

- User registration & login
- Password hashing with bcrypt
- JWT‑based authentication
- Authentication middleware
- Role‑based access control (user vs admin)
- Task CRUD (Create, Read, Update, Delete)
- Ownership verification (users can only modify their tasks)
- Admin route to view all tasks
- Input validation
- Global error handling
- Security middleware (helmet, CORS, rate limiting)

#### Bonus Features Completed

MongoDB Integration

- Replaced in‑memory arrays with persistent Mongoose models
- User and Task schemas implemented
- Database connection via environment variables

#### Bonus Features Not Implemented

- Left out intentionally to keep scope focused
- Single‑task GET endpoint
- Admin user management
- Filtering, sorting, pagination
- Search
- Refresh tokens
- Password reset
- Automated tests

### Project Structure

```mermaid
project/
│ server.js
│ .env
│ .env.example
│ package.json
│
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   └── adminRoutes.js
│
├── middleware/
│   └── auth.js
│
└── models/
    ├── User.js
    └── Task.js
```

### API Endpoints

#### Auth Routes (`/api/auth`)

```text
| Method | Endpoint  | Description                       |
| ------ | --------- | --------------------------------- |
| POST   | /register | Register new user                 |
| POST   | /login    | Login and receive JWT             |
| GET    | /me       | Get current user (requires token) |
```

#### Task Routes (`/api/tasks`)

```text
| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| GET    | /        | Get user’s tasks |
| POST   | /        | Create new task  |
| PUT    | /:id     | Update own task  |
| DELETE | /:id     | Delete own task  |
```

#### Admin Routes (`/api/admin`)

```text
| Method | Endpoint | Description                 |
| ------ | -------- | --------------------------- |
| GET    | /tasks   | View all tasks (admin only) |
```

### Setup & Installation

1. Clone the repo

```sh
git clone https://github.com/jacobdavidstern/fullstack-portfolio.git
cd major-project-4-task-management-api
```

2. Install dependencies

```sh
npm install
```

3. Create .env file

```env
PORT=3001
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

4. Start the server

```sh
npm run dev
```

### Testing

You can test the API using:

- Postman (tested)
- Thunder Client (VS Code)
- curl

#### Authentication requires sending a JWT in the Authorization header:

`Authorization: Bearer <token>`
