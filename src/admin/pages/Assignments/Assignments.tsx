import "./Assignments.css";
import { useState } from "react";

const assignments = [
  {
    id: 1,
    title: "DBMS Lab",
    subject: "DBMS",
    dueDate: "2026-07-15",
    status: "Pending",
  },
  {
    id: 2,
    title: "React Project",
    subject: "Web Technology",
    dueDate: "2026-07-20",
    status: "Completed",
  },
  {
    id: 3,
    title: "Network Report",
    subject: "Computer Networks",
    dueDate: "2026-07-25",
    status: "Pending",
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
            <th>Status</th>
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
                <span
                  className={
                    assignment.status === "Completed"
                      ? "status completed"
                      : "status pending"
                  }
                >
                  {assignment.status}
                </span>
              </td>

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