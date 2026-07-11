import './Students.css'
import { useEffect, useState } from "react";
import StudentModal from "../../components/StudentModal/StudentModal";
//yo students[] lai return agadi matra add gareko cha

// const students = [
//   {
//     id: 1,
//     name: 'John Smith',
//     email: 'john@gmail.com',
//     semester: '6th',
//     status: 'Active',
//   },
//   {
//     id: 2,
//     name: 'Emma Watson',
//     email: 'emma@gmail.com',
//     semester: '5th',
//     status: 'Active',
//   },
//   {
//     id: 3,
//     name: 'David Lee',
//     email: 'david@gmail.com',
//     semester: '4th',
//     status: 'Inactive',
//   },
//   {
//     id: 4,
//     name: 'Sophia Brown',
//     email: 'sophia@gmail.com',
//     semester: '7th',
//     status: 'Active',
//   },
// ]

const API_BASE_URL = "http://localhost:5065/api/students";

interface Student {
  id: number;
  name: string;
  email: string;
  semester: string;
  status: string;
}

export default function Students() {
    //before return add gareko
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    //adding for dynamic search

    const [students,setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
  fetch(API_BASE_URL)
    .then((response) => response.json())
    .then((data) =>
      setStudents(
        data.map((student: Student) => ({
          ...student,
          semester: student.semester || "",
        }))
      )
    )
    .catch((error) => console.error("Failed to load students:", error));
}, []);

const handleDeleteStudent = async (id: number) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this student?");

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

const filteredStudents = students.filter((student) =>
  student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  student.semester.toLowerCase().includes(searchTerm.toLowerCase())
);//upto here
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
          //adding for dynamic search
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Semester</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.semester}</td>
              <td>
                <span
                  className={
                    student.status === 'Active'
                      ? 'status active'
                      : 'status inactive'
                  }
                >
                  {student.status}
                </span>
              </td>

              <td>
                {/* <button className="view-btn">
                  View
                </button> */}

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
     {/* add before div close*/}
         
    <StudentModal
  student={selectedStudent}
  onClose={() => setSelectedStudent(null)}
/>
    </div>
  )
}
