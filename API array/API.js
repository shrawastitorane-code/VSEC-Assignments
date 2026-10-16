
const express = require("express");
const app = express();

app.use(express.json());

// Array of student data
let students = [
    { id: 1, name: "Priya", age: 20, course: "IT" },
    { id: 2, name: "Rahul", age: 21, course: "Computer" },
    { id: 3, name: "Sneha", age: 19, course: "ENTC" }
];


 // 1. Display all students
app.get("/students", (req, res) => {
    res.json(students);
});

// Count total students
app.get("/students/count", (req, res) => {
    res.json({ totalStudents: students.length });
});

// 2. Search student by ID
app.get("/students/:id", (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json(student);
});


// 3. Add a new student
app.post("/students", (req, res) => {
    const { name, age, course } = req.body;

    if (!name || age === undefined || !course) {
        return res.status(400).json({
            message: "Name, age and course are required"
        });
    }

    const newStudent = {
        id: students.length
            ? Math.max(...students.map(s => s.id)) + 1
            : 1,
        name,
        age: Number(age),
        course
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});

// 4. Update a student
app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, age, course } = req.body;

    if (name !== undefined) student.name = name;
    if (age !== undefined) student.age = Number(age);
    if (course !== undefined) student.course = course;

    res.json({
        message: "Student updated successfully",
        student
    });
});

// 5. Delete a student
app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(index, 1)[0];

    res.json({
        message: "Student deleted successfully",
        student: deletedStudent
    });
});

// Start the server
const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});