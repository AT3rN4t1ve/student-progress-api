[Uploading postman_collection.json…]()
# Student Progress Management API

Back-end API สำหรับติดตาม Progress ของนักศึกษา พัฒนาด้วย **Node.js + Express + Prisma ORM + MySQL**

## Features
- CRUD ข้อมูลนักศึกษา (เพิ่ม / แก้ไข / ดูรายคน / ดูทั้งหมด พร้อม pagination & search)
- บันทึกและอัปเดต Progress ของนักศึกษาแยกตามรายวิชา สถานะ `NOT_STARTED` / `IN_PROGRESS` / `COMPLETED`
- API Summary สรุปจำนวนนักศึกษาทั้งหมด และจำนวนแยกตามสถานะ progress
- Validation: email required + unique, required field ห้ามว่าง, status ต้องอยู่ใน enum ที่กำหนด
- Centralized error handling พร้อม HTTP status code ที่เหมาะสม (400 / 404 / 409 / 500)

## Tech Stack
- Node.js, Express
- Prisma ORM
- MySQL

## Database Design
- `students` (id, name, email UNIQUE, phone, major, timestamps)
- `progresses` (id, student_id FK, subject, status ENUM, note, timestamps) — 1 นักศึกษา มีได้หลาย progress record โดย unique ต่อคู่ (student_id, subject)

## Setup
1. `npm install`
2. copy `.env.example` → `.env` แล้วตั้งค่า `DATABASE_URL`
3. `npm run prisma:migrate`
4. (optional) `npm run prisma:seed`
5. `npm run dev`

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/students | สร้างนักศึกษา |
| GET | /api/students | ดูรายชื่อทั้งหมด |
| GET | /api/students/:id | ดูรายคน (พร้อม progress) |
| PUT | /api/students/:id | แก้ไขข้อมูล |
| POST | /api/students/:id/progress | สร้าง/อัปเดต progress |
| GET | /api/students/:id/progress | ดู progress ของนักศึกษา |
| PATCH | /api/progress/:progressId | อัปเดต progress โดยตรงผ่าน id |
| GET | /api/summary | สรุปภาพรวมทั้งระบบ |

## Testing
มี Postman Collection แนบให้ (`postman_collection.json`) import แล้วใช้ได้ทันที ครอบคลุมทั้ง happy path และ edge case (duplicate email, missing field, invalid status)
