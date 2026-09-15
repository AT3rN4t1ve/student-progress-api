const prisma = require("../utils/prisma");
const ApiError = require("../utils/ApiError");
const { isNonEmptyString, isValidStatus, VALID_STATUSES } = require("../utils/validators");

// POST /api/students/:id/progress
// Creates a new progress record, or updates it if the same subject
// already exists for this student (upsert behaviour).
async function upsertProgress(req, res, next) {
  try {
    const studentId = parseInt(req.params.id);
    if (Number.isNaN(studentId)) throw new ApiError(400, "Invalid student id");

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new ApiError(404, "Student not found");

    const { subject, status, note } = req.body;

    if (!isNonEmptyString(subject)) {
      throw new ApiError(400, "Field 'subject' is required");
    }
    if (status !== undefined && !isValidStatus(status)) {
      throw new ApiError(400, `Field 'status' must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    const progress = await prisma.progress.upsert({
      where: {
        student_subject_unique: { studentId, subject: subject.trim() },
      },
      update: {
        status: status || undefined,
        note: note !== undefined ? note : undefined,
      },
      create: {
        studentId,
        subject: subject.trim(),
        status: status || "NOT_STARTED",
        note: note || null,
      },
    });

    res.status(201).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
}

// GET /api/students/:id/progress
async function getStudentProgress(req, res, next) {
  try {
    const studentId = parseInt(req.params.id);
    if (Number.isNaN(studentId)) throw new ApiError(400, "Invalid student id");

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new ApiError(404, "Student not found");

    const progresses = await prisma.progress.findMany({
      where: { studentId },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ success: true, data: progresses });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/progress/:progressId  — update status/note of a specific record directly
async function updateProgressById(req, res, next) {
  try {
    const progressId = parseInt(req.params.progressId);
    if (Number.isNaN(progressId)) throw new ApiError(400, "Invalid progress id");

    const existing = await prisma.progress.findUnique({ where: { id: progressId } });
    if (!existing) throw new ApiError(404, "Progress record not found");

    const { status, note } = req.body;
    if (status !== undefined && !isValidStatus(status)) {
      throw new ApiError(400, `Field 'status' must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    const progress = await prisma.progress.update({
      where: { id: progressId },
      data: {
        status: status !== undefined ? status : undefined,
        note: note !== undefined ? note : undefined,
      },
    });

    res.json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
}

module.exports = { upsertProgress, getStudentProgress, updateProgressById };
