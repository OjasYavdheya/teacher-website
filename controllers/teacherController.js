const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// teacherController.js
exports.dashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const students = await Student.find();
    const attendance = await Attendance.find({ date: today });

    // Map attendance into student objects
    const studentData = students.map(student => {
      const isPresent = attendance.some(a => a.studentId.toString() === student._id.toString());
      return {
        name: student.name,
        rollNo: student.rollNo,
        status: isPresent ? "Present" : "Absent",
        date: today
      };
    });

    res.render("dashboard", { students: studentData });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};


// 1. List all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get attendance day-wise
exports.getAttendanceByDay = async (req, res) => {
  try {
    const { date } = req.params; // e.g. 2025-09-26
    const attendance = await Attendance.find({ date }).populate("studentId", "name rollNo");
    res.render("attendanceByDay", { date, attendance });  // render attendanceByDay.ejs
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

// 3. Get attendance student-wise
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    const attendance = await Attendance.find({ studentId: id });
    res.render("attendanceByStudent", { student, attendance }); // render attendanceByStudent.ejs
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};
