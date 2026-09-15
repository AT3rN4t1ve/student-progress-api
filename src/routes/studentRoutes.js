const express = require("express");
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
} = require("../controllers/studentController");
const {
  upsertProgress,
  getStudentProgress,
} = require("../controllers/progressController");

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);

// Progress nested under a student
router.post("/:id/progress", upsertProgress);
router.get("/:id/progress", getStudentProgress);

module.exports = router;
