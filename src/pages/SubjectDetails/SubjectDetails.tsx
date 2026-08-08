import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiBookOpen, FiFolder, FiBarChart2, FiClock, FiDownload, FiUpload, FiArrowLeft, FiStar, FiCalendar, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import "./SubjectDetails.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5065";

type TabId = "assignments" | "resources" | "analytics" | "priority";

export default function SubjectDetails() {
  const { subjectName } = useParams<{ subjectName: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("assignments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subjectAssignments, setSubjectAssignments] = useState<any[]>([]);
  const [subjectResources, setSubjectResources] = useState<any[]>([]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [examDate, setExamDate] = useState("");

  useEffect(() => {
    if (subjectName) {
      fetchSubjectData();
      const savedExam = localStorage.getItem(`exam-date-${subjectName.toLowerCase()}`) || "";
      setExamDate(savedExam);
    }
  }, [subjectName]);

  const fetchSubjectData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("study-planner-token");
      
      // Fetch assignments + submissions
      const assignRes = await fetch(`${BASE_URL}/api/Submissions/student-assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let allAssignments: any[] = [];
      if (assignRes.ok) {
        allAssignments = await assignRes.json();
      }

      // Fetch resources
      const resRes = await fetch(`${BASE_URL}/api/Resources/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let allResources: any[] = [];
      if (resRes.ok) {
        allResources = await resRes.json();
      }

      // Filter by subject name
      const filteredAssignments = allAssignments.filter(
        (a: any) => a.assignment.subject.toLowerCase() === subjectName?.toLowerCase()
      );
      const filteredResources = allResources.filter(
        (r: any) => r.subject.toLowerCase() === subjectName?.toLowerCase()
      );

      setSubjectAssignments(filteredAssignments);
      setSubjectResources(filteredResources);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch subject data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (assignmentId: number) => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setSubmittingId(assignmentId);
    try {
      const token = localStorage.getItem("study-planner-token");
      const formData = new FormData();
      formData.append("assignmentId", assignmentId.toString());
      formData.append("file", selectedFile);

      const response = await fetch(`${BASE_URL}/api/Submissions/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        alert("Assignment submitted successfully!");
        setSelectedFile(null);
        fetchSubjectData();
      } else {
        const errMsg = await response.text();
        alert(errMsg || "Submission failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission.");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleSaveExamDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjectName) {
      localStorage.setItem(`exam-date-${subjectName.toLowerCase()}`, examDate);
      alert("Exam date saved successfully! This has updated the subject's study priority.");
    }
  };

  // -------------------------------------------------------------
  // CALCULATE PRIORITY USING FULL DASHBOARD LOGIC
  // -------------------------------------------------------------
  const getPriorityInfo = () => {
    const now = new Date();
    const pendingAssignments = subjectAssignments.filter((a) => !a.submission);

    // ----- Assignment statistics -----
    const totalAssign = subjectAssignments.length;
    const completedAssign = subjectAssignments.filter((a) => a.submission).length;
    const pendingCount = pendingAssignments.length;

    // ----- Deadline weighting (pDeadline) -----
    let daysToDeadline = Infinity;
    let pDeadline = 0;
    if (pendingCount > 0) {
      pendingAssignments.forEach((a) => {
        const diffDays = Math.ceil(
          (new Date(a.assignment.dueDate).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (diffDays < daysToDeadline) daysToDeadline = diffDays;
      });

      if (daysToDeadline <= 0) pDeadline = 10;
      else if (daysToDeadline <= 7) pDeadline = 10 - daysToDeadline;
      else if (daysToDeadline <= 14) pDeadline = 3;
      else pDeadline = 1;
    }

    // ----- Exam weighting (pExam) -----
    let daysToExam = Infinity;
    let pExam = 0;
    if (examDate) {
      const diffDays = Math.ceil(
        (new Date(examDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      daysToExam = diffDays;
      if (daysToExam <= 0) pExam = 15;
      else if (daysToExam <= 5) pExam = 15 - daysToExam * 2;
      else if (daysToExam <= 15) pExam = 8 - daysToExam * 0.4;
      else if (daysToExam <= 30) pExam = 2;
      else pExam = 1;
    }

    // ----- Overdue factor -----
    const overdueAssign = subjectAssignments.filter(
      (a) =>
        !a.submission && new Date(a.assignment.dueDate).getTime() < now.getTime()
    ).length;
    const overdueFactor = overdueAssign * 3.5;

    // ----- Completion rate factor -----
    const completionRateFactor =
      totalAssign > 0 ? (1 - completedAssign / totalAssign) * 4.0 : 0;

    // ----- Grade factor -----
    const gradedSubs = subjectAssignments.filter(
      (a) => a.submission && a.submission.status === "Graded" && a.submission.grade !== null
    );
    const avgGrade =
      gradedSubs.length > 0
        ? gradedSubs.reduce((sum: number, a: any) => sum + a.submission.grade, 0) /
          gradedSubs.length
        : null;
    const gradeFactor = avgGrade !== null ? (5.0 - avgGrade) * 1.5 : 0;

    // ----- Deadline factor (weighted) -----
    const deadlineFactor = pDeadline * 0.8;

    // ----- Exam factor (weighted) -----
    const examFactor = pExam * 0.8;

    const pBacklog = Math.min(5, pendingCount * 1.5);
    const totalRaw =
      pendingCount * 2.0 +
      overdueFactor +
      completionRateFactor +
      gradeFactor +
      deadlineFactor +
      examFactor;
    const finalScore = Math.min(10, Math.max(0.5, parseFloat(totalRaw.toFixed(1))));

    // ----- Priority level -----
    let level: "High" | "Medium" | "Low" = "Low";
    if (finalScore >= 7.0) level = "High";
    else if (finalScore >= 4.0) level = "Medium";

    return {
      finalScore,
      pBacklog,
      level,
      pDeadline,
      pExam,
      daysToDeadline,
      daysToExam,
      pendingCount,
      overdueAssign,
      avgGrade,
    };
  };

  const priority = getPriorityInfo();

  // -------------------------------------------------------------
  // ANALYTICS DATA
  // -------------------------------------------------------------
  const totalTasks = subjectAssignments.length;
  const completedTasks = subjectAssignments.filter((a) => a.submission).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const gradedAssignments = subjectAssignments.filter((a) => a.submission?.status === "Graded" && a.submission?.grade);
  const averageGrade = gradedAssignments.length > 0
    ? (gradedAssignments.reduce((acc, a) => acc + a.submission.grade, 0) / gradedAssignments.length).toFixed(1)
    : "0.0";

  // SVG Progress Ring calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  if (loading) {
    return <div className="student-loading">Loading subject details...</div>;
  }

  if (error) {
    return (
      <div className="student-error-container">
        <FiAlertCircle size={40} color="#ef4444" />
        <p>{error}</p>
        <button onClick={fetchSubjectData} className="student-btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="subject-detail-container">
      
      {/* Header */}
      <div className="subject-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FiArrowLeft /> Back to Dashboard
        </button>
        <div className="subject-title-row">
          <div>
            <h1>{subjectName}</h1>
            <p className="subtitle">Course Details and Study Plan</p>
          </div>
          
          {/* Priority Score badge */}
          <div className={`subject-priority-badge ${priority.level.toLowerCase()}`}>
            <FiClock size={16} />
            <span>Priority Score: {priority.finalScore}/10 ({priority.level})</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="subject-tabs">
        <button 
          className={activeTab === "assignments" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("assignments")}
        >
          <FiBookOpen /> Assignments ({subjectAssignments.length})
        </button>
        <button 
          className={activeTab === "resources" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("resources")}
        >
          <FiFolder /> Resources ({subjectResources.length})
        </button>
        <button 
          className={activeTab === "analytics" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("analytics")}
        >
          <FiBarChart2 /> Analytics
        </button>
        <button 
          className={activeTab === "priority" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("priority")}
        >
          <FiClock /> Scheduling Priority
        </button>
      </div>

      {/* Tab Content */}
      <div className="subject-tab-content">
        
        {/* 1. ASSIGNMENTS TAB */}
        {activeTab === "assignments" && (
          <div className="tab-pane">
            <h2>Course Assignments</h2>
            {subjectAssignments.length === 0 ? (
              <p className="no-data">No assignments uploaded for this course yet.</p>
            ) : (
              <div className="assignments-list">
                {subjectAssignments.map((a: any) => {
                  const assignment = a.assignment;
                  const submission = a.submission;
                  const isPastDue = new Date(assignment.dueDate).getTime() < new Date().getTime();

                  return (
                    <div key={assignment.id} className="assignment-item-card">
                      <div className="assignment-item-header">
                        <div>
                          <h3>{assignment.title}</h3>
                          <p className="due-date">
                            <FiCalendar /> Due: {new Date(assignment.dueDate).toLocaleDateString()} at {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        {/* Status tag */}
                        <div>
                          {submission ? (
                            <span className={`status-badge ${submission.status.toLowerCase()}`}>
                              <FiCheckCircle /> {submission.status}
                            </span>
                          ) : isPastDue ? (
                            <span className="status-badge overdue">
                              <FiAlertCircle /> Overdue
                            </span>
                          ) : (
                            <span className="status-badge pending">
                              <FiClock /> Pending
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="description">{assignment.description || "No description provided."}</p>

                      {/* Download Attachments if any */}
                      {assignment.fileName && (
                        <div className="attachment-box">
                          <span>Reference material: {assignment.fileName}</span>
                          <a 
                            href={`${BASE_URL}/Uploads/Assignments/${assignment.filePath}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="download-link"
                          >
                            <FiDownload /> Download
                          </a>
                        </div>
                      )}

                      {/* Grades display */}
                      {submission?.status === "Graded" && (
                        <div className="grading-box">
                          <div className="stars">
                            <span>Grade: </span>
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} fill={i < submission.grade ? "#eab308" : "none"} color={i < submission.grade ? "#eab308" : "#cbd5e1"} size={18} />
                            ))}
                            <span className="grade-score">({submission.grade}/5 Stars)</span>
                          </div>
                          {submission.feedback && <p className="feedback"><strong>Feedback:</strong> "{submission.feedback}"</p>}
                        </div>
                      )}

                      {/* Upload Form (if not submitted) */}
                      {!submission && (
                        <div className="upload-submission-section">
                          <label className="upload-label">
                            <FiUpload /> Choose file (.pdf, .docx, .doc)
                            <input 
                              type="file" 
                              accept=".pdf,.docx,.doc" 
                              onChange={handleFileChange} 
                              className="hidden-file-input"
                            />
                          </label>
                          {selectedFile && <span className="selected-filename">Selected: {selectedFile.name}</span>}
                          
                          <button 
                            onClick={() => handleUploadSubmit(assignment.id)}
                            disabled={submittingId === assignment.id || !selectedFile}
                            className="submit-submission-btn"
                          >
                            {submittingId === assignment.id ? "Uploading..." : "Submit Assignment"}
                          </button>
                        </div>
                      )}

                      {submission && submission.status !== "Graded" && (
                        <div className="grading-box pending">
                          <p className="no-margin"><FiClock /> Submitted on {new Date(submission.submissionDate).toLocaleDateString()}. Awaiting grade from teacher.</p>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. RESOURCES TAB */}
        {activeTab === "resources" && (
          <div className="tab-pane">
            <h2>Course Resources</h2>
            <p className="pane-desc">Reference notes, syllabi, and templates uploaded by your teacher.</p>
            {subjectResources.length === 0 ? (
              <p className="no-data">No learning resources uploaded for this course yet.</p>
            ) : (
              <div className="resources-grid">
                {subjectResources.map((r: any) => (
                  <div key={r.id} className="resource-card">
                    <div className="resource-icon-badge">
                      <FiFolder size={28} />
                    </div>
                    <div className="resource-details">
                      <h3>{r.title}</h3>
                      <p className="type">Format: {r.type || "Document"}</p>
                      {r.fileName && (
                        <a 
                          href={`${BASE_URL}/Uploads/Resources/${r.filePath}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="resource-download-btn"
                        >
                          <FiDownload /> Download {r.fileName.substring(r.fileName.lastIndexOf('.') + 1).toUpperCase()}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="tab-pane">
            <h2>Performance & Analytics</h2>
            
            <div className="analytics-summary-cards">
              
              {/* Radial Completion Gauge */}
              <div className="analytics-card-item">
                <h3>Completion Rate</h3>
                <div className="radial-gauge-container">
                  <svg width="150" height="150">
                    <circle cx="75" cy="75" r={radius} stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                    <circle 
                      cx="75" cy="75" r={radius} stroke="#4f46e5" strokeWidth="12" fill="transparent" 
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90 75 75)"
                    />
                  </svg>
                  <div className="gauge-text">
                    <span className="percentage">{completionPercentage}%</span>
                    <span className="label">{completedTasks}/{totalTasks} Tasks</span>
                  </div>
                </div>
              </div>

              {/* Performance Score */}
              <div className="analytics-card-item center-align">
                <h3>Average Grade</h3>
                <div className="average-grade-display">
                  <span className="grade-value">{averageGrade}</span>
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        fill={i < Math.round(parseFloat(averageGrade)) ? "#eab308" : "none"} 
                        color={i < Math.round(parseFloat(averageGrade)) ? "#eab308" : "#cbd5e1"} 
                        size={24} 
                      />
                    ))}
                  </div>
                  <p className="label">Based on {gradedAssignments.length} graded tasks</p>
                </div>
              </div>

            </div>

            {/* Custom SVG Bar Chart of Graded items */}
            {gradedAssignments.length > 0 && (
              <div className="analytics-card-item full-width" style={{ marginTop: "2rem" }}>
                <h3>Grade Breakdown</h3>
                <div className="svg-chart-container" style={{ marginTop: "1.5rem" }}>
                  <svg width="100%" height="220" viewBox="0 0 500 220" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[1, 2, 3, 4, 5].map((g) => (
                      <line key={g} x1="30" y1={200 - g * 35} x2="480" y2={200 - g * 35} stroke="#f1f5f9" strokeWidth="1" />
                    ))}
                    
                    {/* Bars */}
                    {gradedAssignments.map((ga, idx) => {
                      const barWidth = 40;
                      const spacing = (450 / gradedAssignments.length);
                      const x = 50 + idx * spacing;
                      const barHeight = ga.submission.grade * 35;
                      const y = 200 - barHeight;
                      
                      return (
                        <g key={ga.assignment.id}>
                          <rect 
                            x={x} 
                            y={y} 
                            width={barWidth} 
                            height={barHeight} 
                            rx="6" 
                            fill="#6366f1" 
                          />
                          <text x={x + barWidth/2} y={y - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="#4f46e5">
                            {ga.submission.grade}★
                          </text>
                          <text x={x + barWidth/2} y="215" textAnchor="middle" fontSize="10" fill="#64748b" width={barWidth}>
                            {ga.assignment.title.length > 8 ? ga.assignment.title.substring(0, 8) + ".." : ga.assignment.title}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Bottom axis line */}
                    <line x1="30" y1="200" x2="480" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. PRIORITY TAB */}
        {activeTab === "priority" && (
          <div className="tab-pane">
            <h2>Priority Scheduling Logic</h2>
            <p className="pane-desc">We use an OS-inspired scheduling algorithm to evaluate which courses require immediate study time based on active criteria.</p>
            
            <div className="priority-breakdown-container">
              
              {/* Parameter display */}
              <div className="priority-card-metric">
                <h3>Calculation Parameters</h3>
                <table className="priority-table">
                  <tbody>
                    <tr>
                      <td><strong>Closest Assignment Deadline:</strong></td>
                      <td>
                        {priority.daysToDeadline === Infinity 
                          ? "No pending assignments" 
                          : `${priority.daysToDeadline} days remaining (Urgency score: ${priority.pDeadline.toFixed(1)})`}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Days Until Next Exam:</strong></td>
                      <td>
                        {priority.daysToExam === Infinity 
                          ? "No exam date set" 
                          : `${priority.daysToExam} days remaining (Urgency score: ${priority.pExam.toFixed(1)})`}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Assignment Backlog:</strong></td>
                      <td>{priority.pendingCount} incomplete tasks (Backlog score: {priority.pBacklog.toFixed(1)})</td>
                    </tr>
                    <tr className="total-row">
                      <td><strong>Total Priority Score:</strong></td>
                      <td>{priority.finalScore} / 10 (Urgency Level: <span className={priority.level.toLowerCase()}>{priority.level}</span>)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Set Exam Date form */}
              <div className="priority-card-metric">
                <h3>Set/Edit Exam Date</h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>Input the date of your upcoming exam for this subject to adjust your priority scheduling metrics.</p>
                <form onSubmit={handleSaveExamDate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <input 
                    type="date" 
                    value={examDate} 
                    onChange={(e) => setExamDate(e.target.value)}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "1rem"
                    }}
                  />
                  <button type="submit" className="student-btn-primary">
                    Update Exam Date
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
