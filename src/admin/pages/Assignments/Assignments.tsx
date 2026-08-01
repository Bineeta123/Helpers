import "./Assignments.css";
import { useEffect, useState, type FormEvent } from "react";

const API_URL = `${import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "http://localhost:5065"}/api/Assignments`;

type Assignment = {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  createdAt?: string;
  description?: string;
  fileName?: string;
  filePath?: string;
  classId?: number;
};

type Submission = {
  id: number;
  assignmentId: number;
  studentId: number;
  student?: {
    name: string;
    email: string;
    rollNumber: string;
  };
  submissionDate: string;
  fileName: string;
  filePath: string;
  status: string;
  grade?: number;
  feedback?: string;
};

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Grading states
  const [gradingSubId, setGradingSubId] = useState<number | null>(null);
  const [stars, setStars] = useState(5);
  const [feedback, setFeedback] = useState("");

  const BASE_URL = API_URL.replace("/api/Assignments", "");

  const loadAssignments = async () => {
    const token = localStorage.getItem("study-planner-token");
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setAssignments(Array.isArray(data) ? data : []);
  };

  const loadMyClasses = async () => {
    try {
      const token = localStorage.getItem("study-planner-token");
      const response = await fetch(`${BASE_URL}/api/Assignments/my-classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMyClasses(data);
      }
    } catch (err) {
      console.error("Error loading teacher classes", err);
    }
  };

  const loadSubmissions = async (assignmentId: number) => {
    try {
      const token = localStorage.getItem("study-planner-token");
      const response = await fetch(`${BASE_URL}/api/Submissions/assignment/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error("Error loading submissions", err);
    }
  };

  useEffect(() => {
    loadAssignments();
    loadMyClasses();
  }, []);

  const handleAddAssignment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    if (classId) {
      formData.append("classId", classId);
    }
    if (file) {
      formData.append("file", file);
    }

    const token = localStorage.getItem("study-planner-token");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      alert(`Status: ${response.status}\n${error}`);
      return;
    }

    setTitle("");
    setSubject("");
    setDescription("");
    setDueDate("");
    setClassId("");
    setFile(null);
    setShowAddForm(false);

    loadAssignments();
  };

  const handleView = async (id: number) => {
    const token = localStorage.getItem("study-planner-token");

    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("Assignment not found");
      return;
    }

    const data = await response.json();
    setSelectedAssignment(data);
    loadSubmissions(id);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");

    if (!confirmDelete) return;

    const token = localStorage.getItem("study-planner-token");

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("Failed to delete assignment");
      return;
    }

    loadAssignments();
  };

  const handleGradeSubmission = async (e: FormEvent) => {
    e.preventDefault();
    if (gradingSubId === null || !selectedAssignment) return;

    try {
      const token = localStorage.getItem("study-planner-token");
      const response = await fetch(`${BASE_URL}/api/Submissions/grade/${gradingSubId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ grade: stars, feedback }),
      });

      if (response.ok) {
        setGradingSubId(null);
        setFeedback("");
        setStars(5);
        loadSubmissions(selectedAssignment.id);
      } else {
        alert("Failed to save grade");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="assignments-page">
      <div className="assignments-header">
        <div>
          <h1>Assignments Manager</h1>
          <p>Create assignments and grade student submissions.</p>
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

          <select
            required
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ddd" }}
          >
            <option value="">Publish to Class (Required)...</option>
            {myClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className} ({cls.semester} - {cls.section || "Any"})
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description/Instructions"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ddd" }}
          />

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px", color: "#4a5568" }}>Upload Assignment File (Optional):</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ width: "100%", padding: "5px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f7fafc" }}
            />
          </div>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
        <div className="assignment-details" style={{ backgroundColor: "#f8fafc", padding: "1.5rem", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
          <h2>{selectedAssignment.title}</h2>
          <p><strong>Subject:</strong> {selectedAssignment.subject}</p>
          <p><strong>Due Date:</strong> {selectedAssignment.dueDate.slice(0, 10)}</p>
          {selectedAssignment.description && (
            <p><strong>Description:</strong> {selectedAssignment.description}</p>
          )}
          {selectedAssignment.filePath && (
            <p>
              <strong>Attachment:</strong>{" "}
              <a
                href={`${BASE_URL}/Uploads/Assignments/${selectedAssignment.filePath}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#2563eb", textDecoration: "underline", fontWeight: "bold" }}
              >
                Download {selectedAssignment.fileName}
              </a>
            </p>
          )}

          {/* Submissions Grading List */}
          <div style={{ marginTop: "2rem", borderTop: "1px solid #cbd5e1", paddingTop: "1.5rem" }}>
            <h3>Student Submissions ({submissions.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              {submissions.map((sub) => (
                <div key={sub.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <strong style={{ fontSize: "1.1rem" }}>{sub.student?.name}</strong>
                      <span style={{ fontSize: "0.85rem", color: "#64748b", marginLeft: "0.5rem" }}>({sub.student?.rollNumber})</span>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.2rem" }}>Submitted: {new Date(sub.submissionDate).toLocaleString()}</div>
                    </div>
                    <span style={{ 
                      fontSize: "0.85rem", 
                      fontWeight: 600, 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "999px",
                      background: sub.status === "Graded" ? "#dcfce7" : "#eff6ff",
                      color: sub.status === "Graded" ? "#16a34a" : "#2563eb"
                    }}>
                      {sub.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                    <a
                      href={`${BASE_URL}/Uploads/Submissions/${sub.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline", fontSize: "0.9rem" }}
                    >
                      Download Submission: {sub.fileName}
                    </a>

                    {sub.status === "Graded" ? (
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} style={{ color: star <= (sub.grade || 0) ? "#eab308" : "#cbd5e1", fontSize: "1.2rem" }}>★</span>
                        ))}
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setGradingSubId(sub.id);
                          setStars(5);
                          setFeedback("");
                        }}
                        style={{ padding: "0.4rem 0.8rem", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}
                      >
                        Grade Submission
                      </button>
                    )}
                  </div>

                  {sub.feedback && (
                    <div style={{ fontStyle: "italic", background: "#f8fafc", padding: "0.5rem", borderRadius: "6px", fontSize: "0.85rem", border: "1px dashed #e2e8f0" }}>
                      Feedback: {sub.feedback}
                    </div>
                  )}

                  {/* Grading Modal Form Inline */}
                  {gradingSubId === sub.id && (
                    <form onSubmit={handleGradeSubmission} style={{ marginTop: "1rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span>Grade Stars (1-5):</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            type="button" 
                            key={star} 
                            onClick={() => setStars(star)}
                            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: star <= stars ? "#eab308" : "#cbd5e1" }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        required
                        placeholder="Add some feedback/marks notes..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "0.5rem" }}
                      />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button type="submit" style={{ padding: "0.4rem 0.8rem", background: "#16a34a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Save</button>
                        <button type="button" onClick={() => setGradingSubId(null)} style={{ padding: "0.4rem 0.8rem", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
              {submissions.length === 0 && (
                <div style={{ color: "#64748b", fontStyle: "italic", fontSize: "0.9rem" }}>No student submissions yet.</div>
              )}
            </div>
          </div>

          <button className="delete-btn" onClick={() => setSelectedAssignment(null)} style={{ marginTop: "1.5rem" }}>
            Close Detail Panel
          </button>
        </div>
      )}

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
            <th>Title</th>
            <th>Subject</th>
            <th>Due Date</th>
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
                <button className="view-btn" onClick={() => handleView(assignment.id)}>
                  View / Grade
                </button>

                <button className="delete-btn" onClick={() => handleDelete(assignment.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredAssignments.length === 0 && (
            <tr>
              <td colSpan={5}>No assignments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}