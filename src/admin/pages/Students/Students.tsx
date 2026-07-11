import './Students.css'
import { useState } from "react";
import StudentModal from "../../components/StudentModal/StudentModal";
import AddStudentModal from "../../components/AddStudentModal/AddStudentModal";
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

export default function Students() {
    //before return add gareko
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>(null);
    //adding for dynamic search

    const [students,setStudents] = useState([
  {
    id: 1,
    name: "John Smith",
    email: "john@gmail.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Emma Watson",
    email: "emma@gmail.com",
    status: "Active",
  },
  {
    id: 3,
    name: "David Lee",
    email: "david@gmail.com",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sophia Brown",
    email: "sophia@gmail.com",
    status: "Active",
  },
]);
    const [searchTerm, setSearchTerm] = useState("");
    const handleAddStudent = (student: {
  name: string;
  email: string;
  status: string;
}) => {
  if (editingStudent) {
    setStudents(
      students.map((s) =>
        s.id === editingStudent.id
          ? { ...s, ...student }
          : s
      )
    );
  } else {
    const newStudent = {
      id: students.length + 1,
      ...student,
    };

    setStudents([...students, newStudent]);
  }

  setEditingStudent(null);
  };

  setStudents([...students, newStudent]);
};

const filteredStudents = students.filter((student) =>
  student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  student.email.toLowerCase().includes(searchTerm.toLowerCase()) 
);//upto here
  return (
    <div className="students-page">

      <div className="students-header">
        <div>
          <h1>Students</h1>
          <p>Manage registered students.</p>
        </div>

        <button className="add-btn" onClick={() => 
        {
        setEditingStudent(null);
        setIsAddModalOpen(true);
       }}
        >
          + Add Student
        </button>
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
         className="edit-btn"
        onClick={() => {
       setEditingStudent(student);
       setIsAddModalOpen(true);
      }}
      >
      Edit
              </button>

                <button className="delete-btn">
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

  <AddStudentModal
  open={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onSave={handleAddStudent}
    student={editingStudent}
/>
    </div>
  )
}