const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Student = require("./models/Student");

const app = express();

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ Error:", err));

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Teacher app running on port ${PORT}`));
