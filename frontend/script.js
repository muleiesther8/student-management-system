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
      <button onclick="editStudent(${student.id}, '${student.name}', '${student.registration_number}', '${student.course}', ${student.year})">Edit</button>
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
// Edit student (collect input)
  function editStudent(id, name, reg, course, year) {

  const newName = prompt("Edit name:", name);
  const newReg = prompt("Edit registration number:", reg);
  const newCourse = prompt("Edit course:", course);
  const newYear = prompt("Edit year:", year);

  if (!newName || !newReg || !newCourse || !newYear) {
    alert("All fields required");
    return;
  }
  updateStudent(id, newName, newReg, newCourse, newYear);
}
// Update student
  async function updateStudent(id, name, registration_number, course, year) {

  try {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        registration_number,
        course,
        year
      })
    });

    loadStudents();

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