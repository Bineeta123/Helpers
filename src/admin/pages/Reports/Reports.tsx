import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Reports.css";

interface StudentReport {
  studentId: number;
  studentName: string;
  assignmentsSubmitted: number;
  assignmentsNotSubmitted: number;
  resourcesViewed: number;
  progress: number;
  loginCount: number;
}

export default function Reports() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<StudentReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudentReport = async () => {
    const endpoints = [
      `http://localhost:5065/api/Reports/student/${studentId}`,
      `https://localhost:7161/api/Reports/student/${studentId}`
    ];
    
    let reportData = null;
    
    for (const url of endpoints) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          reportData = await response.json();
          break; // Found working port!
        }
      } catch (err) {
        // Silence connection errors and try next port
      }
    }

    if (reportData) {
      setReport(reportData);
    } else {
      console.error("Failed to fetch student report from all configured backend endpoints.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudentReport();
  }, [studentId]);

  if (loading) {
    return <div className="reports-page"><p>Loading report data...</p></div>;
  }

  if (!report) {
    return (
      <div className="reports-page">
        <p>No report found for this student.</p>
        <button className="refresh-btn" onClick={() => navigate("/admin/students")}>
          Back to Students
        </button>
      </div>
    );
  }

  const reportData = [
    {
      icon: "📚",
      title: "Assignments Submitted",
      value: report.assignmentsSubmitted,
    },
    {
      icon: "❌",
      title: "Assignments Pending",
      value: report.assignmentsNotSubmitted,
    },
    {
      icon: "📁",
      title: "Resources Viewed",
      value: report.resourcesViewed,
    },
    {
      icon: "🔑",
      title: "Times Logged In",
      value: report.loginCount,
    },
  ];

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/students")}
            style={{
              marginBottom: "15px",
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "#4a5568",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            ← Back to Students
          </button>
          <h1>Student Performance Report</h1>
          <p>Detailed overview for <strong>{report.studentName}</strong> (ID: {report.studentId})</p>
        </div>
      </div>

      <div className="report-grid">
        {reportData.map((item) => (
          <div className="report-card" key={item.title}>
            <div className="report-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="recent-report">
        <h2>Learning Progress Indicator</h2>
        <div style={{ background: "#edf2f7", borderRadius: "10px", padding: "3px", width: "100%", marginTop: "10px" }}>
          <div
            style={{
              width: `${report.progress}%`,
              background: "#48bb78",
              height: "24px",
              borderRadius: "8px",
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              lineHeight: "24px",
              transition: "width 0.5s ease-in-out"
            }}
          >
            {report.progress}% Complete
          </div>
        </div>
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#718096" }}>
          Progress is computed based on the ratio of assignments submitted against overall assigned tasks.
        </p>
      </div>
    </div>
  );
}
