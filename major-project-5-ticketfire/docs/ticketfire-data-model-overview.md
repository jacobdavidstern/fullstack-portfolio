# TicketFire Data Model Overview

This document summarizes the core backend domain model for TicketFire: collections, relationships, validation rules, and the multi‑tenant structure.

# 1. Domain Overview

TicketFire manages school‑hosted events across multiple districts (clients).
The MVP supports:

- Multi‑tenant districts (clients)
- Schools within each district
- Venues owned by schools
- Departments (Athletics, Music, Theatre, Activities)
- Events hosted by schools
- Optional ticket counts for dashboard metrics
- Admin + client authentication
- No public ticketing flow in MVP

# 2. Lookup Collections (Static)

### **department_type**

Represents the department hosting an event.

Examples:

- ATHLETICS
- MUSIC
- THEATRE
- ACTIVITIES

### **ticket_type**

Enum-like lookup for seeded ticket metrics.

Values:

- CHILD
- STUDENT
- ADULT

# 3. Core Collections

### **clients**

School districts.
Fields: `_id`, `slug`, `name`, timestamps.

### **schools**

Belong to a client.
Fields: `_id`, `client_id`, `name`, `slug`.

### **venues**

Belong to a school.
Fields: `_id`, `schoolSlug`, `name`, `capacity`.

### **departments**

Belong to a client.
Fields: `_id`, `name`, `slug`.

### **events**

Belong to a school + department + venue.
Key fields:

- `event_name`
- `schoolSlug`
- `department_id`
- `venue_id`
- `start_at`
- `doors_open_before`
- `total_tickets`
- `tickets_sold`
- `published`

### **tickets**

Exist only for dashboard metrics.
Fields:

- `event_id`
- `ticket_type_id`
- `token`
- optional `email`, `phone`

# 4. Key Validation Rules

### Events

- `doors_open_before` must be a multiple of 5 up to 90
- `tickets_sold <= total_tickets`
- `department_id` must reference a valid department
- `venue_id` must reference a valid venue
- Only certain fields are mutable after creation

### Tickets

- PII‑minimal
- `token` is opaque, internal only
- No redemption or scanning fields

---

# 5. Multi‑Tenant Structure

Each client owns:

- departments
- schools
- venues
- events
- users

```
Client
├── Departments
├── Schools
├── Venues
├── Events
└── Users
```

# 6. Seed Data Summary

MVP includes:

- 2 clients
- 4 schools per client
- 4 venues per school
- 24 events per client
- 12 pre‑sold tickets per event

# 7. Analytics (High-Level)

Revenue is derived from tickets:

- Organizer revenue = `SUM(faceValue)`
- TicketFire revenue = `SUM(fee)`
- Total paid = `faceValue + fee`

Aggregation pipelines filter → join → group → project.

# 8. Core Principles

- Collections are tenant‑scoped
- Events anchor all revenue and ticket metrics
- Tickets are immutable
- Revenue is derived, never stored
- Seed data simulates realistic district activity
