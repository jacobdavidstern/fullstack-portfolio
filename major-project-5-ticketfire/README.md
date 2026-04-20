# TicketFire 🔥

TicketFire is a full‑stack multi-tenant event ticketing platform built to help organizations create, manage, and monitor ticketed events with an emphasis on clarity, role‑aware workflows, and secure architectural boundaries.

The system provides distinct client and administrator interfaces, each with tailored permissions, navigation, and UI design. A structured RBAC model governs access across the platform, ensuring that users interact only with the data and operations appropriate to their role. Authorization middleware enforces tenant isolation and resource‑level access, forming a clear security boundary between clients and the platform.

TicketFire is built on a React frontend and an Express.js backend, with MongoDB providing persistent storage. The backend employs a layered middleware pipeline — including security headers, CORS, rate limiting, authentication, and RBAC authorization — before routing requests to business logic. This structure keeps the system predictable, maintainable, and resistant to common classes of misuse.

On the frontend, React delivers a responsive, component‑driven interface with consistent layout primitives, structured navigation, and a unified event creation/editing workflow. The UI prioritizes usability and performance, providing clear feedback through loading states, validation, and error handling.

## Design Philosophy

TicketFire emphasizes:

- Clear domain boundaries
- Predictable routing and API structure
- Explicit role‑aware workflows
- Maintainable, readable code over premature abstraction

The system is built with an MVP‑first mindset: implement essential workflows end‑to‑end, enforce clean separation between domains, and defer complexity until it becomes necessary. The architecture favors explicitness, using layered middleware for security, authentication, and authorization, and keeping business logic isolated from transport concerns.

This approach reflects practical full‑stack engineering: thoughtful API design, predictable authentication flows, tenant‑aware authorization, and a UI that mirrors backend constraints. Every feature is shaped by clarity, correctness, and long‑term maintainability.

## Features

TicketFire supports the core workflows required for managing multi‑tenant event operations, from client onboarding to event publishing and ticket tracking.

### Automatic Numbering

- Client numbers are generated automatically on creation
- Event numbers are generated per‑client and increment sequentially

### Role‑Based Access Control

- Client Owners can create users and manage all client resources
- Client Officials can create and manage events
- Client Staff can view event details (read‑only access)

### Event Management

- Events can be published or unpublished
- Ticket counts and capacity are validated
- Doors‑open time is validated in 5‑minute increments
- Event start times are validated to precede event end times

### User Management

- Duplicate user email addresses are prevented
- Users belong to a client and inherit client‑scoped permissions

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB
- Auth: JWT-based authentication
- Tooling: npm

## Architecture Overview

```text
        ┌───────────────────────────────────────────────────────┐
        │                       Frontend                        │
        │                   React + Vite SPA                    │
        │                                                       │
        │  ┌───────────────────────┬──────────────────────────┐ │
        │  │   Real Mode           │  Demo Mode frontend-only │ │
        │  │   HTTP REST API       │  Static JSON Mock API    │ │
        │  │   Express backend     │  client/public/demo/...  │ │
        │  └───────────────────────┴──────────────────────────┘ │
        │                                                       │
        │  Shared UI Layer:                                     │
        │    • Role‑aware navigation                            │
        │    • Event CRUD UI                                    │
        │    • Auth flows (JWT)                                 │
        │    • Routing + components                             │
        └──────────────┬────────────────────────────────────────┘
                       │ HTTP (REST)
                       ▼
        ┌──────────────────────────┐
        │         Backend          │
        │       Express API        │
        │  Security middleware     │
        │  Auth + RBAC guards      │
        │  Tenant‑scoped routing   │
        └─────────────┬────────────┘
                      │ Mongoose
                      ▼
        ┌──────────────────────────┐
        │        MongoDB Atlas     │
        │  Clients                 │
        │  Users (scoped)          │
        │  Events (per‑client)     │
        │  Schools / Depts / Venues│
        └──────────────────────────┘
```

- Frontend: React + Vite SPA
- Backend: Express API with layered middleware (security, auth, RBAC, routing)
- Database: MongoDB Atlas with tenant‑scoped collections and indexes
- Auth: JWT-based login with rate limiting and protected routes
- Multi‑tenant design with per‑client event numbering and scoped access
- Deployment: Demo Mode frontend on Vercel

## Demo Mode (Frontend‑Only Mock API Layer)

TicketFire includes a fully isolated Demo Mode that allows the entire frontend to run without a backend. This mode is designed for portfolio demos, UI development, and environments where the real API is unavailable.

Demo Mode replaces all network requests with static JSON files stored under:

`client/public/demo/`

This provides a predictable, backend‑free environment that mirrors the real API shape.

### How Demo Mode Works

The frontend supports a `?demo=` URL flag that switches the data source to a local JSON mock API containing:

- 1 client
- 2 schools
- 4 departments
- 8 venues
- 12 events

When enabled, all GET requests made through the shared apiFetch utility are transparently rewritten to load JSON files from `client/public/demo/summit/`

The UI, routing, RBAC logic, and component tree remain unchanged — only the data source is swapped.

Demo Mode mirrors the real API structure, including:

- client details
- event lists
- event details crucial to event managers: start time, end time, sales, published
- schools, departments, and venues

This keeps the UI behavior identical to real mode while avoiding the need for a running backend.

### Enabling / Disabling Demo Mode

Demo Mode can be controlled via URL flags:

```sh
?demo=true  // Demo Mode on
?demo=false // Demo Mode off
```

No flag — defaults to:

- development: real backend
- production: demo mode

Examples:

```sh
http://localhost:5173/?demo=true
https://ticketfire-demo.vercel.app/?demo=false
```

### Why Demo Mode Exists

Demo Mode provides several benefits:

- Backend‑free demos: The frontend can be deployed anywhere without requiring a server.
- Stable data: UI flows can be demonstrated without worrying about database state.
- Faster UI development: Components can be built and tested without waiting for backend endpoints.

## Live Demo

**Deployed Demo Mode frontend:**
[https://fullstack-ticketfire.vercel.app/](https://fullstack-ticketfire.vercel.app/)

## Future Enhancements

- Customer authentication and ticket access, allowing ticket buyers to securely view their purchased tickets online.
- Payment processing integration to support online ticket purchases.
- Expanded reporting and analytics for event organizers.
- Advanced ticket formats including passes, season passes, and season tickets.
- Ticket redemption.

## Getting Started

### Installation

1. Clone the repository and navigate to the project directory

```sh
git clone https://github.com/jacobdavidstern/fullstack-portfolio.git
cd major-project-5-ticketfire
```

2. Install dependencies:

```sh
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Application

You need to run both the frontend and backend servers independently in separate terminal windows.

### Starting the Backend Server

1. Open a terminal window
2. Navigate to the server directory:

```sh
cd server
```

3. Start the server:

```sh
# For development with auto-restart
npm run dev

# Or for production mode
npm start
```

The server will run on `http://localhost:3001` (or the port specified in your .env file)

### Starting the Frontend Client

1. Open a NEW terminal window (keep the backend running)
2. Navigate to the client directory:

```sh
cd client
```

3. Start the development server:

```sh
npm run dev
```

The client will run on `http://localhost:5173` (default Vite port)

## Environment Variables

### Server (.env file)

Create a `.env` file in the server directory, or copy `.env.example` to `.env`:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
```

## Core Workflows

TicketFire supports the essential multi‑tenant event lifecycle:

- Administrators onboard new clients
- Client Owners create users (Officials and Staff)
- Officials create and manage events
- Staff access event details in read‑only mode
- All operations are tenant‑scoped and role‑restricted

## Sample Data

- A sample node database export and script are included in `server/utils/MongoDB-Exports/`
- **Postman Collection:** of client resources — Clients, Users, Schools, Departments, Venues, and Events

### Client

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server

- `npm run dev` - Start server with nodemon (auto-restart)
- `npm start` - Start server in production mode
