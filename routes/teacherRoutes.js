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


// Date-wise attendance - NEW IMPROVED VERSION
router.get("/attendance-by-date", async (req, res) => {
  try {
    const { date } = req.query;
    let records = [];
    let selectedDate = null;

    if (date) {
      selectedDate = date;
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      // Find all attendance records for the selected date
      records = await Attendance.find({
        date: { $gte: start, $lte: end }
      })
      .populate("studentId", "name roll_no")
      .sort({ "studentId.roll_no": 1 });
    }

    res.render("attendanceByDate", { 
      records, 
      selectedDate 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching attendance");
  }
});

// Download Report Route
router.get("/download-report", async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).send("Date is required");
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      date: { $gte: start, $lte: end }
    })
    .populate("studentId", "name roll_no")
    .sort({ "studentId.roll_no": 1 });

    // Create CSV content
    let csv = "Roll No,Student Name,Status\n";
    records.forEach(record => {
      csv += `${record.studentId.roll_no},${record.studentId.name},${record.status}\n`;
    });

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_${date}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating report");
  }
});

// Old day-wise attendance route (for backward compatibility)
router.get("/attendance/day", async (req, res) => {
  res.redirect("/teacher/attendance-by-date");
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
