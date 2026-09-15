const ApiError = require("../utils/ApiError");

// Catches errors thrown/passed via next(err) from any route and
// returns a consistent JSON error shape.
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || undefined,
    });
  }

  // Prisma known error codes
  if (err.code === "P2002") {
    // Unique constraint violation
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${err.meta?.target || "unknown"}`,
    });
  }

  if (err.code === "P2025") {
    // Record not found
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: "Route not found" });
}

module.exports = { errorHandler, notFoundHandler };
