import "./Assignments.css";

const assignments = [
  {
    id: 1,
    title: "Database Project",
    subject: "Database",
    deadline: "2026-07-20",
    semester: "6th",
    status: "Pending",
  },
  {
    id: 2,
    title: "React UI",
    subject: "Web Technology",
    deadline: "2026-07-18",
    semester: "5th",
    status: "Submitted",
  },
  {
    id: 3,
    title: "Networking Lab",
    subject: "Computer Networks",
    deadline: "2026-07-25",
    semester: "4th",
    status: "Pending",
  },
];

export default function Assignments() {
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
          placeholder="Search assignment..."
        />
      </div>

      <table className="assignments-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Deadline</th>
            <th>Semester</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.title}</td>
              <td>{assignment.subject}</td>
              <td>{assignment.deadline}</td>
              <td>{assignment.semester}</td>

              <td>
                <span
                  className={
                    assignment.status === "Submitted"
                      ? "status submitted"
                      : "status pending"
                  }
                >
                  {assignment.status}
                </span>
              </td>

              <td>
                <button className="edit-btn">Edit</button>

                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}