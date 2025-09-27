const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");


// All students
router.get("/students", async (req, res) => {
  const students = await Student.find().sort({ name: 1 });
  res.render("students", { students });
});

// // Show student selection page before attendance
// router.get("/student/choose", async (req, res) => {
//   const students = await Student.find().sort({ name: 1 });
//   res.render("chooseStudent", { students });
// });

// Day-wise attendance
router.get("/attendance/day", async (req, res) => {
  const dateParam = req.query.date;
  if (!dateParam) return res.send("Please select a date");

  const start = new Date(dateParam);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  const records = await Attendance.find({ date: { $gte: start, $lt: end } }).populate("studentId");
  res.render("attendanceByDay", { date: dateParam, records });
});

// Student-wise attendance
router.get("/student-attendance", async (req, res) => {
  try {
    const { rollNo, name } = req.query;

    let student;
    if (rollNo) {
      student = await Student.findOne({ rollNo: rollNo });
    } else if (name) {
      student = await Student.findOne({ name: name });
    }

    if (!student) {
      return res.render("attendanceByStudent", { student: null, error: "Student not found" });
    }

    res.render("attendanceByStudent", { student, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// // Choose Student 
// router.get("/student", async (req, res) => {
//   const studentId = req.query.id;
//   const student = await Student.findById(studentId);
//   const records = await Attendance.find({ studentId }).sort({ date: -1 });
//   res.render("attendanceByStudent", { student, records });
// });

// // search Box
// router.get("/student-attendance", async (req, res) => {
//   const students = await Student.find().sort({ name: 1 });
//   res.render("attendanceByStudent");
// });

module.exports = router;
