const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Student = require("./models/Student");
const bodyParser = require("body-parser");
const teacherRoutes = require("./routes/teacherRoutes");
const connectDB = require("./config/db");

const app = express();
connectDB(); // connect MongoDB


app.use(bodyParser.json());


// EJS + Static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Teacher dashboard
app.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ date: -1 });
    res.render("dashboard", { students });
  } catch (err) {
    res.status(500).send("Error fetching students");
  }
});

// Routes
app.use("/teacher", teacherRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
