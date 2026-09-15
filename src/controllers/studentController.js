const prisma = require("../utils/prisma");
const ApiError = require("../utils/ApiError");
const { isNonEmptyString, isValidEmail } = require("../utils/validators");

// POST /api/students
async function createStudent(req, res, next) {
  try {
    const { name, email, phone, major } = req.body;

    if (!isNonEmptyString(name)) {
      throw new ApiError(400, "Field 'name' is required");
    }
    if (!isValidEmail(email)) {
      throw new ApiError(400, "Field 'email' is required and must be a valid email");
    }

    const existing = await prisma.student.findUnique({ where: { email: email.trim() } });
    if (existing) {
      throw new ApiError(409, "Email already exists");
    }

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? String(phone).trim() : null,
        major: major ? String(major).trim() : null,
      },
    });

    res.status(201).json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
}

// GET /api/students?page=1&pageSize=20&search=abc
async function getStudents(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize) || 20, 1), 100);
    const search = req.query.search ? String(req.query.search).trim() : undefined;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : undefined;

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: "asc" },
      }),
      prisma.student.count({ where }),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/students/:id
async function getStudentById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, "Invalid student id");

    const student = await prisma.student.findUnique({
      where: { id },
      include: { progresses: true },
    });

    if (!student) throw new ApiError(404, "Student not found");

    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
}

// PUT /api/students/:id
async function updateStudent(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, "Invalid student id");

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Student not found");

    const { name, email, phone, major } = req.body;
    const data = {};

    if (name !== undefined) {
      if (!isNonEmptyString(name)) throw new ApiError(400, "Field 'name' cannot be empty");
      data.name = name.trim();
    }

    if (email !== undefined) {
      if (!isValidEmail(email)) throw new ApiError(400, "Field 'email' must be a valid email");
      const emailOwner = await prisma.student.findUnique({ where: { email: email.trim() } });
      if (emailOwner && emailOwner.id !== id) {
        throw new ApiError(409, "Email already exists");
      }
      data.email = email.trim();
    }

    if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;
    if (major !== undefined) data.major = major ? String(major).trim() : null;

    const student = await prisma.student.update({ where: { id }, data });

    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
}

module.exports = { createStudent, getStudents, getStudentById, updateStudent };
