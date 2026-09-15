# Student Progress Management API

Back-end API for tracking student progress, built with **Node.js**, **Express**, **Prisma ORM**, and **MySQL**.

## Tech Stack

- Node.js + Express — HTTP server / routing
- Prisma ORM — schema, migrations, type-safe queries
- MySQL — database
- dotenv — environment config

## Database Design

Two tables:

- **students** — `id, name, email (unique), phone, major, created_at, updated_at`
- **progresses** — `id, student_id (FK), subject, status (enum), note, created_at, updated_at`

Design decision: **one student can have many progress records**, one per `subject`
(e.g. "Database Systems", "Web Development"). The pair `(student_id, subject)` is
unique, so re-submitting progress for the same subject **updates** the existing
record instead of creating a duplicate. This models a student progressing through
multiple courses/topics rather than having a single overall status.

`status` is an enum: `NOT_STARTED | IN_PROGRESS | COMPLETED`.

Schema source of truth is `prisma/schema.prisma`. An equivalent raw SQL script is
included at `prisma/schema.sql` for reference / manual setup without Prisma migrate.

## Setup

### 1. Prerequisites
- Node.js 18+
- A running MySQL server (local or remote)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Copy `.env.example` to `.env` and update the `DATABASE_URL` with your MySQL credentials:
```bash
cp .env.example .env
```
```
DATABASE_URL="mysql://root:password@localhost:3306/student_progress_db"
```
(The database itself does not need to exist beforehand — `prisma migrate dev` creates it.)

### 4. Run migrations (creates DB + tables)
```bash
npm run prisma:migrate
```

### 5. (Optional) Seed sample data
```bash
npm run prisma:seed
```

### 6. Start the server
```bash
npm run dev      # with auto-reload (nodemon)
# or
npm start
```

Server runs at `http://localhost:3000` by default. Health check: `GET /health`.

## API Reference

All responses are JSON in the shape `{ success, data }` or `{ success: false, message }`.

### Students

| Method | Endpoint              | Description                     |
|--------|-----------------------|----------------------------------|
| POST   | `/api/students`       | Create a student                 |
| GET    | `/api/students`       | List students (paginated, search)|
| GET    | `/api/students/:id`   | Get one student (with progress)  |
| PUT    | `/api/students/:id`   | Update a student                 |

**POST /api/students**
```json
{ "name": "Somchai Jaidee", "email": "somchai@example.com", "phone": "0812345678", "major": "Computer Science" }
```
- `name`, `email` required; `phone`, `major` optional
- `email` must be a valid, unique email → `409` if already used

**GET /api/students?page=1&pageSize=20&search=somchai**
- `search` matches against name/email

**PUT /api/students/:id** — partial update, same validation rules as create.

### Progress

| Method | Endpoint                          | Description                              |
|--------|------------------------------------|-------------------------------------------|
| POST   | `/api/students/:id/progress`      | Create/update progress for a subject      |
| GET    | `/api/students/:id/progress`      | List a student's progress records         |
| PATCH  | `/api/progress/:progressId`       | Update a specific progress record directly|

**POST /api/students/:id/progress**
```json
{ "subject": "Database Systems", "status": "IN_PROGRESS", "note": "Chapter 3 of 5" }
```
- `subject` required
- `status` optional, defaults to `NOT_STARTED`; must be one of `NOT_STARTED | IN_PROGRESS | COMPLETED`
- If a progress record for that `(student, subject)` already exists, it is updated (upsert) instead of duplicated

### Summary

| Method | Endpoint        | Description                  |
|--------|------------------|-------------------------------|
| GET    | `/api/summary`  | Aggregate stats               |

```json
{
  "success": true,
  "data": {
    "totalStudents": 10,
    "totalProgressRecords": 18,
    "completed": 6,
    "inProgress": 8,
    "notStarted": 4
  }
}
```

## Validation & Error Handling

- Required fields (`name`, `email`, `subject`) cannot be empty
- `email` must match a valid email format and be unique (checked at the app level, enforced at the DB level too)
- `status` must be one of the three allowed enum values
- Errors return consistent JSON: `{ "success": false, "message": "..." }` with an appropriate HTTP status (`400` validation, `404` not found, `409` conflict, `500` server error)
- Prisma-specific errors (unique constraint `P2002`, record not found `P2025`) are translated to proper HTTP responses in a central error-handling middleware

## Project Structure

```
src/
  app.js                  # Express app + route mounting
  server.js               # Entry point
  routes/                 # Route definitions
  controllers/             # Request handlers / business logic
  middleware/errorHandler.js
  utils/                   # Prisma client, ApiError, validators
prisma/
  schema.prisma            # Prisma schema (source of truth)
  schema.sql                # Equivalent raw SQL (reference)
  seed.js                    # Sample data
```

## Possible Future Improvements

- Auth (JWT) to protect write endpoints
- Automated tests (Jest + Supertest)
- Soft delete instead of hard delete
- Filtering `/api/students` by major, progress status
