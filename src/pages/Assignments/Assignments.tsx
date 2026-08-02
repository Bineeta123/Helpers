import { useEffect, useState, type FormEvent } from "react";
import "../../App.css";
import "./Assignments.css";

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7161";

type StudentAssignmentRow = {
  assignment: {
    id: number;
    title: string;
    subject: string;
    dueDate: string;
    description?: string;
    fileName?: string;
    filePath?: string;
  };
  submission?: {
    id: number;
    submissionDate: string;
    fileName: string;
    filePath: string;
    status: string;
    grade?: number;
    feedback?: string;
  };
};

export default function Assignments() {
  const [dataList, setDataList] = useState<StudentAssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("study-planner-token");
      const response = await fetch(`${BASE_URL}/api/Submissions/student-assignments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDataList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmitAssignment = async (e: FormEvent, assignmentId: number) => {
    e.preventDefault();
    if (!file) {
      alert("Please choose a file to submit.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId.toString());
    formData.append("file", file);

    try {
      const token = localStorage.getItem("study-planner-token");
      const response = await fetch(`${BASE_URL}/api/Submissions/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSubmittingId(null);
        setFile(null);
        fetchAssignments();
      } else {
        const errText = await response.text();
        alert(`Failed to submit: ${errText}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: "2rem", color: "#64748b" }}>Loading class assignments...</div>;

  const completedCount = dataList.filter((item) => item.submission?.status === "Graded" || item.submission?.status === "Submitted").length;
  const pendingCount = dataList.length - completedCount;

  return (
    <section className="section-grid">
      <div className="card card-white" style={{ gridColumn: "span 2" }}>
        <div className="card-title">Class Assignments</div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          {dataList.map((item) => {
            const { assignment, submission } = item;
            const isSubmitted = !!submission;
            const isGraded = submission?.status === "Graded";

            return (
              <div 
                key={assignment.id} 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "0.75rem", 
                  padding: "1.25rem", 
                  borderRadius: "10px", 
                  border: isSubmitted ? "1px solid #e2e8f0" : "1px solid #fca5a5",
                  background: isSubmitted ? "white" : "#fff5f5"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h3 style={{ margin: 0, color: "#1f2937" }}>{assignment.title}</h3>
                    <span style={{ fontSize: "0.85rem", background: "#e2e8f0", color: "#475569", padding: "0.15rem 0.5rem", borderRadius: "6px", display: "inline-block", marginTop: "0.25rem" }}>
                      {assignment.subject}
                    </span>
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: "0.85rem", 
                      fontWeight: 600, 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "999px",
                      background: isGraded ? "#dcfce7" : isSubmitted ? "#eff6ff" : "#fee2e2",
                      color: isGraded ? "#16a34a" : isSubmitted ? "#2563eb" : "#dc2626"
                    }}>
                      {isGraded ? "Graded" : isSubmitted ? "Submitted" : "Pending"}
                    </span>
                  </div>
                </div>

                {assignment.description && (
                  <p style={{ margin: 0, color: "#4b5563", fontSize: "0.95rem" }}>{assignment.description}</p>
                )}

                {assignment.filePath && (
                  <div style={{ fontSize: "0.9rem" }}>
                    <strong>Reference File:</strong>{" "}
                    <a 
                      href={`${BASE_URL}/Uploads/Assignments/${assignment.filePath}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: "#2563eb", textDecoration: "underline" }}
                    >
                      Download {assignment.fileName}
                    </a>
                  </div>
                )}

                <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "#64748b" }}>
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  
                  {!isSubmitted ? (
                    submittingId === assignment.id ? (
                      <form onSubmit={(e) => handleSubmitAssignment(e, assignment.id)} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input 
                          type="file" 
                          required 
                          onChange={(e) => setFile(e.target.files?.[0] || null)} 
                          style={{ fontSize: "0.8rem" }}
                        />
                        <button type="submit" style={{ padding: "0.3rem 0.6rem", background: "#16a34a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Submit</button>
                        <button type="button" onClick={() => setSubmittingId(null)} style={{ padding: "0.3rem 0.6rem", background: "#dc2626", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                      </form>
                    ) : (
                      <button 
                        onClick={() => setSubmittingId(assignment.id)} 
                        style={{ padding: "0.4rem 0.8rem", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
                      >
                        Add Submission
                      </button>
                    )
                  ) : (
                    <div>
                      <span style={{ color: "#16a34a" }}>Submitted: {submission.fileName}</span>
                      {isGraded && (
                        <div style={{ marginTop: "0.4rem", display: "flex", flexDirection: "column", gap: "0.25rem", background: "#f8fafc", padding: "0.5rem", borderRadius: "6px", border: "1px dashed #cbd5e1" }}>
                          <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                            <span style={{ marginRight: "0.5rem", fontWeight: 600 }}>Grade:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} style={{ color: star <= (submission.grade || 0) ? "#eab308" : "#cbd5e1", fontSize: "1.1rem" }}>★</span>
                            ))}
                          </div>
                          {submission.feedback && (
                            <p style={{ margin: 0, fontStyle: "italic", color: "#475569" }}>Feedback: {submission.feedback}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {dataList.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
              No assignments published to your class yet.
            </div>
          )}
        </div>
      </div>

      <div className="card card-white" style={{ gridColumn: "span 2" }}>
        <div className="card-title">Progress Tracker</div>
        <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
          <div className="progress-item" style={{ flex: 1 }}>
            <span>Completed / Submitted</span>
            <strong>{completedCount} / {dataList.length}</strong>
          </div>
          <div className="progress-item" style={{ flex: 1 }}>
            <span>Pending Submission</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
