const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");


// All Students
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.render("students", { students });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching students");
  }
});

// Edit Student
router.post("/edit-student", async (req, res) => {
  try {
    const { studentId, name, roll_no, email } = req.body;
    
    await Student.findByIdAndUpdate(studentId, {
      name,
      roll_no,
      email
    });
    
    res.redirect("/teacher/students");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating student");
  }
});

// Delete Student
router.post("/delete-student", async (req, res) => {
  try {
    const { studentId } = req.body;
    
    // Delete student
    await Student.findByIdAndDelete(studentId);
    
    // Also delete all attendance records for this student
    await Attendance.deleteMany({ studentId });
    
    res.redirect("/teacher/students");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting student");
  }
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

// Student-wise attendance (search by Roll No.)
router.get("/student-attendance", async (req, res) => {
  try {
    const { roll_no } = req.query;

    // If no roll_no yet, show just the search bar
    if (!roll_no) {
      return res.render("attendanceByStudent", { student: null, records: [] });
    }

    // Find the student
    const student = await Student.findOne({ roll_no: roll_no });

    if (!student) {
      return res.render("attendanceByStudent", { student: null, records: [] });
    }

    // Find attendance records for that student
    const records = await Attendance.find({ studentId: student._id }).sort({ date: -1 });

    res.render("attendanceByStudent", { student, records });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching student attendance");
  }
});

// API endpoint to fetch all students (for search suggestions)
router.get("/students-data", async (req, res) => {
  try {
    const students = await Student.find({}, 'name roll_no').sort({ name: 1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching students" });
  }
});

// API endpoint to fetch student attendance data (for AJAX loading)
router.get("/student-attendance-data", async (req, res) => {
  try {
    const { roll_no } = req.query;

    if (!roll_no) {
      return res.json({ student: null, records: [] });
    }

    // Find the student
    const student = await Student.findOne({ roll_no: roll_no });

    if (!student) {
      return res.json({ student: null, records: [] });
    }

    // Find attendance records for that student
    const records = await Attendance.find({ studentId: student._id }).sort({ date: -1 });

    res.json({ student, records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching student attendance" });
  }
});


module.exports = router;
