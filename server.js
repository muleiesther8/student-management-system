const express = require("express");
const cors = require("cors");
const app = express();
const studentRoutes = require("./routes/students"); // import routes


app.use(cors());
app.use(express.json()); // for parsing application/json

// Use student routes
app.use("/students", require("./routes/students"));

// Test route
app.get("/", (req, res) => {
  res.send("Student Management System API Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});