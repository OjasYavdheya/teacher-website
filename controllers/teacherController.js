const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

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
    const { date } = req.params;
    const attendance = await Attendance.find({ date }).populate("studentId", "name rollNo");
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get attendance student-wise
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.find({ studentId: id });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
