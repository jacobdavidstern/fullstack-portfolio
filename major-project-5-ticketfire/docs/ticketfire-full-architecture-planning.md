# TicketFire Full Architecture Planning

This document provides the detailed architectural reasoning behind TicketFire’s frontend: component trees, state ownership, data flow, and the mental model used to structure the application.

# 1. Component Architecture Model

TicketFire uses a four-layer decomposition:

### 1. Route / Page Owner

- Corresponds to the URL
- Owns data fetching
- Owns auth guard
- Owns page-level state
- Passes data downward

Children never fetch data.

### 2. Layout Components

- AppLayout, Sidebar, Header
- Provide structure only
- No business logic
- No data fetching

### 3. Section / Container Components

- StatGrid, SchoolStatsList, EventsList
- Receive data as props
- May manage small UI state
- Orchestrate leaf components

### 4. Presentational Components

- StatCard, EventCard, Buttons, Inputs
- Stateless or minimal local state
- Render pixels only

This model keeps responsibilities crisp and predictable.

# 2. State Ownership Model

### Global (AuthContext)

- user
- client
- token
- login() / logout()
- isAuthenticated
- loading

### Page-Level State

Owned by the page because multiple children depend on it:

- dashboardStats
- schoolStats
- events[]
- isLoading
- error

### Local Component State

Owned by the component because it affects only itself:

- form inputs
- validation errors
- UI toggles

### Rules

- Pages fetch data
- Components display data
- Forms own their own inputs
- Auth lives globally
- State lifts only when multiple children need the same answer

# 3. Annotated Component Trees

These trees show structure _and_ state ownership.

## 3.1 Login Page

```
LoginPage [owns: authError]
├── AuthLayout
│   └── LoginForm [owns: formState, isSubmitting]
```

- Page handles auth outcome + redirect
- Form owns inputs + validation

## 3.2 Admin Dashboard

```
AdminDashboardPage [owns: stats, isLoading, error]
├── (auth guard)
├── AppLayout
│   ├── Sidebar
│   ├── Header
│   └── MainContent
│       └── StatGrid
│           ├── StatCard (clientsCount)
│           ├── StatCard (monthlyTicketSales)
│           ├── StatCard (activeEvents)
│           ├── StatCard (draftEvents)
│           ├── StatCard (monthlyRevenue)
│           └── StatCard (annualRevenue)
```

- Page fetches admin stats
- Cards are pure display

## 3.3 Client Dashboard

```
ClientDashboardPage [owns: stats, schoolStats, isLoading, error]
├── (auth guard)
├── AppLayout
│   ├── Sidebar
│   ├── Header
│   └── MainContent
│       ├── StatGrid [props: stats]
│       │   ├── StatCard
│       │   ├── StatCard
│       │   ├── StatCard
│       │   └── StatCard
│       └── SchoolStatsList [props: schoolStats]
│           ├── SchoolCard
│           └── SchoolCard
```

- Page fetches all dashboard data
- Grid + cards are pure consumers

## 3.4 Client Events List

```
ClientEventsPage [owns: events[], isLoading, error]
├── (auth guard)
├── AppLayout
│   ├── Sidebar
│   ├── Header
│   └── MainContent
│       ├── PageHeader
│       │   └── CreateEventButton
│       └── EventsList [props: events[]]
│           ├── EventCard
│           ├── EventCard
│           └── EventCard
```

- Page fetches events
- Cards display event data

## 3.5 Client Event Create/Edit

```
ClientEventEditPage [owns: submissionError]
├── (auth guard)
├── AppLayout
│   ├── Sidebar
│   ├── Header
│   └── MainContent
│       └── EventForm [owns: formData, validationErrors, isSubmitting]
```

- Page handles API outcome + navigation
- Form owns all input state

# 4. How State Was Lifted (Reasoning)

The state-lifting process followed four passes:

### PASS 1 — Identify dynamic questions

Example:
“How many clients exist?”
“Are events still loading?”
“Did the request fail?”

If the answer can change → it’s state.

### PASS 2 — Ask: Who needs the same answer?

If multiple components depend on the same data, lift state to their lowest common ancestor.

### PASS 3 — Decide ownership vs consumption

Owner: fetches + stores
Consumers: receive props

### PASS 4 — Annotate the tree

Mark `[owns: ...]` at the owner.
Mark `[props: ...]` at consumers.

This ensures predictable data flow.

# 5. Auth Model (Detailed)

AuthContext provides:

- user
- client
- token
- login()
- logout()
- isAuthenticated
- loading

### Responsibilities

- Pages enforce auth
- Layout never enforces auth
- Components never check auth

### Storage

- token in memory
- user fetched or decoded

This keeps auth global, predictable, and isolated.

# 6. Core Architectural Principles

- Pages fetch data
- Components display data
- Forms own their own inputs
- Auth lives globally
- Layout is structural, not logical
- State lifts only when multiple children need the same answer
- Leaf components never own shared state
- Component trees start at the route owner
- Layout components never fetch or own business logic

These principles guided the entire implementation.
