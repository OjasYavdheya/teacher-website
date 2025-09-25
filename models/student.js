const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  status: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", studentSchema);
