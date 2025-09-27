const express = require("express");
const path = require("path");
const Student = require("./models/Student");
const teacherRoutes = require("./routes/teacherRoutes");
const connectDB = require("./config/db");

const app = express();
connectDB(); // connect MongoDB


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// EJS + Static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("home");  // new home.ejs
});
app.use("/teacher", teacherRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
