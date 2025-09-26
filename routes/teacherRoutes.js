const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// Dashboard (summary + links)
router.get("/dashboard", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const students = await Student.find();

    // attach today's status for each student
    const summary = await Promise.all(
      students.map(async (s) => {
        const record = await Attendance.findOne({
          studentId: s._id,
          date: {
            $gte: new Date(today),
            $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
          }
        });
        return {
          _id: s._id,
          name: s.name,
          rollNo: s.rollNo,
          status: record ? "Present" : "Absent"
        };
      })
    );

    res.render("dashboard", { students: summary });
  } catch (err) {
    res.status(500).send("Error loading dashboard");
  }
});

// All students
router.get("/students", async (req, res) => {
  const students = await Student.find();
  res.render("students", { students });
});

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
router.get("/attendance/student/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  const records = await Attendance.find({ studentId: student._id });
  res.render("attendanceByStudent", { student, records });
});

module.exports = router;
