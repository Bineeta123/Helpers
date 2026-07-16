import "./Assignments.css";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://localhost:7161/api/Assignments";

type Assignment = {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  createdAt?: string;
  status?: "Published" | "Pending";
  submissions?: number;
  totalStudents?: number;
};

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("All");
const [statusFilter, setStatusFilter] = useState("All");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const loadAssignments = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setAssignments(data);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleAddAssignment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newAssignment = {
      title,
  subject,
   description,
  dueDate,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAssignment),
    });

    if (!response.ok) {
      alert("Failed to add assignment");
      return;
    }

    setTitle("");
    setSubject("");
    setDueDate("");
    setDescription("");
    setShowAddForm(false);

    loadAssignments();
  };

  const handleView = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      alert("Assignment not found");
      return;
    }

    const data = await response.json();
    setSelectedAssignment(data);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");

    if (!confirmDelete) return;

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to delete assignment");
      return;
    }

    loadAssignments();
  };

  const filteredAssignments = assignments.filter((assignment)=>{

const matchesSearch=

assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||

assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());

const matchesSubject=

subjectFilter==="All" ||

assignment.subject===subjectFilter;

const matchesStatus=

statusFilter==="All" ||

assignment.status===statusFilter;

return matchesSearch && matchesSubject && matchesStatus;

});

  return (
    <div className="assignments-page">
      <div className="assignments-header">
        <div>
          <h1>Assignments</h1>
          <p>Manage student assignments.</p>
        </div>

        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          + Add Assignment
        </button>
      </div>

      {showAddForm && (
        <form className="assignment-form" onSubmit={handleAddAssignment}>
          <input
            type="text"
            placeholder="Assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />


          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
           
          <textarea
          placeholder="Assignment description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
           />
           
          
          <div>
            <button type="submit" className="add-btn">
              Save Assignment
            </button>

            <button type="button" className="delete-btn" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedAssignment && (
        <div className="assignment-details">
          <h2>{selectedAssignment.title}</h2>
          <p><strong>Subject:</strong> {selectedAssignment.subject}</p>
          <p><strong>Due Date:</strong> {selectedAssignment.dueDate.slice(0, 10)}</p>
          <p>
      <strong>Description:</strong>
    </p>

    <div className="assignment-description">
      {selectedAssignment.description}
    </div>

          <button className="delete-btn" onClick={() => setSelectedAssignment(null)}>
            Close
          </button>
        </div>
      )}

      <div className="search-section">

<input
type="text"
placeholder="Search assignments..."
value={searchTerm}
onChange={(e)=>setSearchTerm(e.target.value)}
/>

<select
value={subjectFilter}
onChange={(e)=>setSubjectFilter(e.target.value)}
>

<option>All</option>

<option>OS</option>

<option>DBMS</option>

<option>CN</option>

<option>SE</option>

</select>

<select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
>

<option>All</option>

<option>Published</option>

<option>Pending</option>

</select>

</div>

      <table className="assignments-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Due Date</th>
            <th>Status</th>

            <th>Submissions</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredAssignments.map((assignment) => (
            <tr key={assignment.id}>

<td>{assignment.title}</td>

<td>{assignment.subject}</td>

<td>{assignment.dueDate.slice(0, 10)}</td>


 <td>

<span className={assignment.status==="Published"

? "status-published"

: "status-pending"}>

{assignment.status || "Published"}

</span>

</td>

<td>

{assignment.submissions || 0}/{assignment.totalStudents || 50}

</td>

<td>

  <button
    className="view-btn"
    onClick={() => handleView(assignment.id)}
  >
    View
  </button>

  <button
    className="delete-btn"
    onClick={() => handleDelete(assignment.id)}
  >
    Delete
  </button>

</td>
              
            </tr>
          ))}

          {filteredAssignments.length === 0 && (
            <tr>
              <td colSpan={6}>No assignments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}