const prisma = require("../utils/prisma");

// GET /api/summary
// Returns overall counts: total students, and progress-status breakdown
// across all progress records (completed / in-progress / not-started).
async function getSummary(req, res, next) {
  try {
    const [totalStudents, statusCounts] = await Promise.all([
      prisma.student.count(),
      prisma.progress.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    const counts = { NOT_STARTED: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    for (const row of statusCounts) {
      counts[row.status] = row._count.status;
    }

    res.json({
      success: true,
      data: {
        totalStudents,
        totalProgressRecords: counts.NOT_STARTED + counts.IN_PROGRESS + counts.COMPLETED,
        completed: counts.COMPLETED,
        inProgress: counts.IN_PROGRESS,
        notStarted: counts.NOT_STARTED,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
