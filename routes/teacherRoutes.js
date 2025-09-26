const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getAttendanceByDay,
  getAttendanceByStudent,
} = require("../controllers/teacherController");

// Routes
router.get("/students", getAllStudents);
router.get("/attendance/day/:date", getAttendanceByDay);       // /teacher/attendance/day/2025-09-26
router.get("/attendance/student/:id", getAttendanceByStudent); // /teacher/attendance/student/65123456789

module.exports = router;
