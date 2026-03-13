const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Add Student
router.post("/", (req, res) => {
  const { name, registration_number, course, year } = req.body;
  if (!name || !registration_number || !course || !year) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query = "INSERT INTO students (name, registration_number, course, year) VALUES (?, ?, ?, ?)";
  db.query(query, [name, registration_number, course, year], (err, result) => {
    if (err) return res.status(500).json({ error: "Database insertion failed" });
    res.status(201).json({ message: "Student added", studentId: result.insertId });
  });
});

// View All Students
router.get("/", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });
});

// View Single Student
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM students WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json(results[0]);
  });
});

// Update Student
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, registration_number, course, year } = req.body;
  if (!name || !registration_number || !course || !year) {
    return res.status(400).json({ error: "All fields are required" });
  }
  db.query(
    "UPDATE students SET name = ?, registration_number = ?, course = ?, year = ? WHERE id = ?",
    [name, registration_number, course, year, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database update failed" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Student not found" });
      res.json({ message: "Student updated" });
    }
  );
});

// Delete Student
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM students WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database deletion failed" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted" });
  });
});

module.exports = router;