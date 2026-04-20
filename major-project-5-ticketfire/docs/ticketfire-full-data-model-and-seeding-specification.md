# TicketFire Full Data Model & Seeding Specification

This document defines the complete backend domain model for TicketFire: collections, validation rules, lookup tables, seed data, event schedules, and analytics pipelines.

# 1. Domain Overview

TicketFire manages school‑hosted events across multiple districts.
The MVP includes:

- Multi‑tenant districts (clients)
- Schools within each district
- Venues owned by schools
- Departments (Athletics, Music, Theatre, Activities)
- Events hosted by schools
- Optional ticket counts for dashboard metrics
- Admin + client authentication
- No public ticketing or scanning flow

Events and tickets exist solely for dashboard metrics.

# 2. Lookup Collections (Static)

## 2.1 department_type

Represents the department hosting an event.

```json
{
  "_id": "MUSIC",
  "label": "Music"
}
```

Values:

- ATHLETICS
- MUSIC
- THEATRE
- ACTIVITIES

## 2.2 ticket_type

Enum-like lookup for seeded ticket metrics.

```json
{
  "_id": "STUDENT",
  "label": "Student"
}
```

Values:

- CHILD
- STUDENT
- ADULT

# 3. Core Collections

## 3.1 clients (districts)

```json
{
  "_id": "<ObjectId>",
  "slug": "trinity",
  "name": "Trinity SD",
  "created_at": "2026-02-01T00:00:00Z"
}
```

## 3.2 departments

```json
{
  "_id": "<ObjectId>",
  "name": "Physical Education",
  "slug": "athletics"
}
```

## 3.3 schools

```json
{
  "_id": "<ObjectId>",
  "client_id": "trinity",
  "name": "Marshall HS",
  "slug": "marshall_hs",
  "created_at": "2026-02-01T00:00:00Z"
}
```

## 3.4 venues

```json
{
  "_id": "<ObjectId>",
  "schoolSlug": "marshall_hs",
  "name": "Marshall Gym",
  "capacity": 500,
  "created_at": "2026-02-01T00:00:00Z"
}
```

## 3.5 events

```json
{
  "_id": "<ObjectId>",
  "event_name": "Spring Concert",
  "schoolSlug": "marshall_hs",
  "department_id": "MUSIC",
  "venue_id": "marshall_pac",
  "start_at": "2026-03-15T19:00:00Z",
  "doors_open_before": 30,
  "total_tickets": 32,
  "tickets_sold": 16,
  "published": true,
  "created_at": "2026-02-01T00:00:00Z"
}
```

### Event Rules

- `doors_open_before` ∈ {0, 5, 10, …, 90}
- `tickets_sold <= total_tickets`
- `department_id` must reference a valid department
- `venue_id` must reference a valid venue
- Only certain fields are mutable after creation

## 3.6 tickets

```json
{
  "_id": "<ObjectId>",
  "event_id": "<ObjectId>",
  "ticket_type_id": "STUDENT",
  "token": "uuid-or-hash",
  "email": null,
  "phone": null,
  "issued_at": "2026-03-10T12:00:00Z"
}
```

Rules:

- PII-minimal
- No redemption fields
- `token` is opaque, internal only
- Tickets are immutable

## 3.7 admins

```json
{
  "_id": "<ObjectId>",
  "email": "admin@school.edu",
  "password_hash": "bcrypt...",
  "created_at": "2026-02-01T00:00:00Z"
}
```

Admins have full system access by mocking clients who manage their own resources

# 4. Multi‑Tenant Structure

Each client owns:

```
Client
├── Departments
├── Schools
├── Venues
├── Events
└── Users
```

This ensures clean data isolation.

# 5. Seed Data Specification

## 5.1 Departments (per client)

```
Athletics
Music
Theatre
Activities
```

## 5.2 Schools

### Summit

- Washington HS
- Loyola HS

### Trinity

- Marshall HS
- Warren HS

## 5.3 Venues (4 per school)

- Gymnasium
- Natatorium
- Performing Arts Center (PAC)
- Auditorium

## 5.4 Event Schedule (24 per client)

Each client hosts:

- 4 basketball events
- 2 swimming meets
- 2 theatre events
- 2 music events
- 2 dances

Total: **12 events per school district × 2 districts = 24 events**

Each event:

- capacity: 24
- pre-sold tickets: 12

Full JSON seed payloads included in the original planning doc.

# 6. Validation Rules (Detailed)

### Events

- `doors_open_before` must be divisible by 5
- `start_at` must be ISO timestamp
- `schoolSlug` must belong to the client
- `venue_id` must belong to the school
- `department_id` must belong to the client
- `tickets_sold <= total_tickets`

### Tickets

- `token` is opaque
- `email` optional
- `phone` optional (E.164)
- No redemption or scanning fields

# 7. Analytics & Aggregation Pipelines

TicketFire uses MongoDB aggregations for dashboard metrics.

### Common stages:

```json
$match
$lookup
$unwind
$group
$project
$sort
```

## 7.1 Organizer Dashboard Revenue (per event)

```
tickets → events → group by event
```

Pipeline:

```js
[
  { $lookup: { from: 'events', localField: 'eventId', foreignField: '_id', as: 'event' }},
  { $unwind: '$event' },
  { $match: { 'event.organizerId': organizerId }},
  {
    $group: {
      _id: '$eventId',
      eventTitle: { $first: '$event.title' },
      totalFaceValue: { $sum: '$pricing.faceValue' },
      ticketsSold: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      eventId: '$_id',
      eventTitle: 1,
      ticketsSold: 1,
      totalFaceValue: 1
    }
  }
]
```

## 7.2 Admin Dashboard Revenue (TicketFire fees)

```js
[
  {
    $group: {
      _id: null,
      totalFeesCollected: { $sum: '$pricing.fee' },
      totalTicketsSold: { $sum: 1 }
    }
  },
  { $project: { _id: 0, totalFeesCollected: 1, totalTicketsSold: 1 }}
]
```

## 7.3 Optional: Admin Revenue by Event

```js
[
  { $lookup: { from: 'events', localField: 'eventId', foreignField: '_id', as: 'event' }},
  { $unwind: '$event' },
  {
    $group: {
      _id: '$eventId',
      eventTitle: { $first: '$event.title' },
      totalFees: { $sum: '$pricing.fee' },
      ticketsSold: { $sum: 1 }
    }
  }
]
```

# 8. Architecture Rationale

- Stateless REST simplifies scaling
- MongoDB fits flexible MVP schema
- Lookup collections behave like enums
- Tickets are immutable for accurate revenue
- Events anchor all reporting
- Multi‑tenant structure keeps data isolated

# 9. Post‑MVP Notes

Future additions:

- Season tickets
- Sport passes
- District‑wide events
- Shared venues
- Clients without schools (e.g., associations)

These require adding `sport` or `pass` metadata to events.
