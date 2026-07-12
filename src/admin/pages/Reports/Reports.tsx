import { useEffect, useState } from "react";
import "./Reports.css";

interface Report {
  totalStudents: number;
  assignmentsSubmitted: number;
  resourcesUploaded: number;
  averageCompletion: number;
  monthlySummary: string;
}

export default function Reports() {
  const [report, setReport] = useState<Report | null>(null);

  const fetchReport = async () => {
    try {
      const response = await fetch("https://localhost:7161/api/Reports");

      if (!response.ok) {
        throw new Error("Failed to fetch report.");
      }

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const reportData = report
    ? [
        {
          icon: "👨‍🎓",
          title: "Total Students",
          value: report.totalStudents,
        },
        {
          icon: "📚",
          title: "Assignments Submitted",
          value: report.assignmentsSubmitted,
        },
        {
          icon: "📁",
          title: "Resources Uploaded",
          value: report.resourcesUploaded,
        },
        {
          icon: "📈",
          title: "Average Completion",
          value: `${report.averageCompletion}%`,
        },
      ]
    : [];

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p>Overview of system statistics.</p>
        </div>

        <button className="refresh-btn" onClick={fetchReport}>
          Refresh
        </button>
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
        <h2>Monthly Summary</h2>

        {report && (
          <ul>
            <li>✔ {report.assignmentsSubmitted} Assignments Submitted</li>
            <li>✔ {report.resourcesUploaded} Resources Uploaded</li>
            <li>
              ✔ Average Student Progress: {report.averageCompletion}%
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}