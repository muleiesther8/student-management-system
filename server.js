const express = require("express");
const app = express();
const studentRoutes = require("./routes/students"); // import routes

app.use(express.json());

// Use student routes
app.use("/students", studentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Student Management System API Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});