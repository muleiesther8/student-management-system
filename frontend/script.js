const API = "http://localhost:3000/students";

// Elements
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("search");
const courseFilter = document.getElementById("courseFilter");
const yearFilter = document.getElementById("yearFilter");
const addBtn = document.getElementById("addBtn");

// Global array to store students for filtering
let allStudents = [];

// Load students when page loads
window.addEventListener("DOMContentLoaded", loadStudents);

// Event listeners
addBtn.addEventListener("click", addStudent);
searchInput.addEventListener("input", filterStudents);
courseFilter.addEventListener("change", filterStudents);
yearFilter.addEventListener("change", filterStudents);

// Load students from API
async function loadStudents() {
  try {
    const res = await fetch(API);
    allStudents = await res.json(); // store globally
    renderStudents(allStudents);
  } catch (err) {
    console.error("Failed to load students:", err);
  }
}

// Render students in the list
function renderStudents(students) {
  studentList.innerHTML = "";
  students.forEach(student => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${student.name} (${student.registration_number}) - ${student.course} Year ${student.year}
      <button onclick="updateStudent(${student.id})">Update</button>
      <button onclick="deleteStudent(${student.id})">Delete</button>
    `;
    studentList.appendChild(li);
  });
}

// Add student
async function addStudent() {
  const name = document.getElementById("name").value;
  const registration_number = document.getElementById("reg").value;
  const course = document.getElementById("course").value;
  const year = document.getElementById("year").value;

  if (!name || !registration_number || !course || !year) {
    alert("All fields are required!");
    return;
  }

  try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, registration_number, course, year })
    });

    // Clear inputs
    document.getElementById("name").value = "";
    document.getElementById("reg").value = "";
    document.getElementById("course").value = "";
    document.getElementById("year").value = "";

    loadStudents(); // refresh list
  } catch (err) {
    console.error("Failed to add student:", err);
  }
}

// Delete student
async function deleteStudent(id) {
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadStudents();
  } catch (err) {
    console.error("Failed to delete student:", err);
  }
}

// Update student
async function updateStudent(id) {
  const name = prompt("Enter new name:");
  const registration_number = prompt("Enter new registration number:");
  const course = prompt("Enter new course:");
  const year = prompt("Enter new year:");

  if (!name || !registration_number || !course || !year) {
    alert("All fields are required!");
    return;
  }

  try {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, registration_number, course, year })
    });
    loadStudents(); // refresh list
  } catch (err) {
    console.error("Failed to update student:", err);
  }
}

// Search / Filter students
function filterStudents() {
  const query = searchInput.value.toLowerCase();
  const selectedCourse = courseFilter.value;
  const selectedYear = yearFilter.value;

  const filtered = allStudents.filter(student => {
    const matchesQuery =
      student.name.toLowerCase().includes(query) ||
      student.registration_number.toLowerCase().includes(query);

    const matchesCourse = selectedCourse ? student.course === selectedCourse : true;
    const matchesYear = selectedYear ? student.year.toString() === selectedYear : true;

    return matchesQuery && matchesCourse && matchesYear;
  });

  renderStudents(filtered);
}