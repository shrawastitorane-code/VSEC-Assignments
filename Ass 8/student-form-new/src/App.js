
import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');

  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const newStudent = {
      id: Date.now(),
      name: name,
      age: age,
      email: email,
      course: course
    };

    setStudents([...students, newStudent]);

    setName('');
    setAge('');
    setEmail('');
    setCourse('');
    setShowStudents(false);

    alert('Student added successfully!');
  }

  return (
    <div>
      <h1>Student Information Form</h1>

      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <label>Age: </label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <br /><br />

        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <label>Course: </label>
        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Add Student</button>
      </form>

      <br />

      <button
        onClick={() => setShowStudents(!showStudents)}
      >
        {showStudents ? 'Hide Students' : 'Display Students'}
      </button>

      {showStudents && (
        <div>
          <h2>Student Details</h2>

          {students.length === 0 ? (
            <p>No students added yet.</p>
          ) : (
            students.map((student) => (
              <div key={student.id}>
                <hr />
                <p>Name: {student.name}</p>
                <p>Age: {student.age}</p>
                <p>Email: {student.email}</p>
                <p>Course: {student.course}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;