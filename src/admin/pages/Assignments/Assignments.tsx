import "./Assignments.css";
import { useState } from "react";

const assignments = [
  {
    id: 1,
    title: "Operating System Lab1",
    subject: "Operating Systems",
    dueDate: "2026-07-15",
  },
  {
    id: 2,
    title: "Agile Assignment 1",
    subject: "Software Dependability",
    dueDate: "2026-07-25",
  },
  {
    id: 3,
    title: "AI Project",
    subject: "Artificial Intelligence",
    dueDate: "2026-07-26",
  },
  {
    id: 4,
    title: "Network Programming Report",
    subject: "Network Programming",
    dueDate: "2026-07-26",
   
  },
  {
    id: 5,
    title: "Software Dependability Assignment",
    subject: "Software Dependability",
    dueDate: "2026-07-27",
   
  },
  {
    id: 6,
    title: "Agile Assignment 2",
    subject: "Agile Software Development",
    dueDate: "2026-08-08",
    
  },
  {
    id: 7,
    title: "Operating System Lab2",
    subject: "Operating Systems",
    dueDate: "2026-08-03",
   
  },
  
];

export default function Assignments() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="assignments-page">
      <div className="assignments-header">
        <div>
          <h1>Assignments</h1>
          <p>Manage student assignments.</p>
        </div>

        <button className="add-btn">
          + Add Assignment
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="assignments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Subject</th>
            <th>Due Date</th>          
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredAssignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.id}</td>
              <td>{assignment.title}</td>
              <td>{assignment.subject}</td>
              <td>{assignment.dueDate}</td>
              <td>
                <button className="view-btn">
                  View
                </button>

                <button className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}