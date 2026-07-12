

import "./Students.css";
import { useEffect, useState } from "react";
import StudentModal from "../../components/StudentModal/StudentModal";

const API_BASE_URL = "http://localhost:5065/api/students";

interface Student {
  id: number;
  name: string;
  email: string;
  status: string;
}

export default function Students() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(API_BASE_URL)
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) =>
        console.error("Failed to load students:", error)
      );
  }, []);

  const handleDeleteStudent = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete student.");
        return;
      }

      setStudents((currentStudents) =>
        currentStudents.filter((student) => student.id !== id)
      );

      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Something went wrong while deleting student.");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="students-page">
      <div className="students-header">
        <div>
          <h1>Students</h1>
          <p>Manage registered students.</p>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="students-table">
        <thead>
          <tr>
         
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
             
              <td>{student.name}</td>
              <td>{student.email}</td>

              <td>
                <span
                  className={
                    student.status === "Active"
                      ? "status active"
                      : "status inactive"
                  }
                >
                  {student.status}
                </span>
              </td>

              <td>
                <button
                  className="view-btn"
                  onClick={() => setSelectedStudent(student)}
                >
                  View
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
