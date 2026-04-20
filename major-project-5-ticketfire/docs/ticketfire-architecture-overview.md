# TicketFire Architecture Overview (TL;DR)

This document summarizes the core structure of the TicketFire frontend: routes, reusable components, state ownership, and architectural principles.

# 1. Pages & Routes

### Public

**/login**

- Authenticates user
- Redirects by role
- No auth required

### Admin

**/admin**

- Admin dashboard overview
- Auth required (admin)

### Client

**/:slug**

- Client dashboard overview
- Auth required (client)

**/:slug/events**

- Client events list
- Auth required (client)

**/:slug/events/:eventNumber/edit**

- Create/edit event
- Auth required (client)

Pages are the only components that fetch data, own page-level state, or enforce auth.

# 2. Reusable Components

### Layout

- **AppLayout** — wraps sidebar, header, main content
- **Sidebar** — role-specific navigation
- **Header** — page title + optional actions

### Auth

- **LoginForm** — owns form inputs
- **AuthInput** — reusable text/password input

### Dashboard

- **StatCard** — label + numeric value
- **StatGrid** — layout for StatCards

### Client

- **SchoolCard** — school-level metrics
- **SchoolStatsList** — renders multiple SchoolCards

### Events

- **EventForm** — owns form state + validation
- **EventInput** — text/textarea
- **EventSelect** — dropdowns

### UI Utilities

- **PrimaryButton**
- **SecondaryButton**
- **LoadingSpinner**
- **ErrorBanner**

# 3. Component Architecture Model

TicketFire uses a four-layer decomposition:

1. **Page (Route Owner)**
   - Fetches data
   - Owns page-level state
   - Enforces auth

2. **Layout Components**
   - Sidebar, Header, MainContent
   - No data fetching
   - No business logic

3. **Section / Container Components**
   - StatGrid, SchoolStatsList, EventsList
   - Receive data as props
   - May manage small UI state

4. **Presentational Components**
   - StatCard, EventCard, Buttons, Inputs
   - Stateless or minimal local state

# 4. State Ownership

### Global (AuthContext)

- user
- client
- token
- login() / logout()
- isAuthenticated
- loading

### Page-Level

- dashboardStats
- events[]
- schoolStats
- isLoading
- error

### Local (Component-Level)

- form inputs
- validation errors
- UI toggles

# 5. Auth Model

AuthContext provides:

- user
- client
- token
- login()
- logout()
- isAuthenticated
- loading

Token stored in memory (and optionally localStorage).
Pages enforce auth; components never check auth.

# 6. Core Principles

- Pages fetch data
- Components display data
- Forms own their own inputs
- Auth lives globally
- Layout is structural, not logical
- State lifts only when multiple children need the same answer
- Leaf components never own shared state
