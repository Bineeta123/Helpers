import { useEffect, useState } from "react";
import { FiBarChart2, FiCheckCircle, FiStar, FiInfo } from "react-icons/fi";
import "../../App.css";
import "./Analytics.css";

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7161";

type SubjectMetric = {
  name: string;
  total: number;
  completed: number;
  percentage: number;
  averageGrade: number;
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjectMetrics, setSubjectMetrics] = useState<SubjectMetric[]>([]);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [completedSubmissions, setCompletedSubmissions] = useState(0);
  const [gradedCount, setGradedCount] = useState(0);
  const [globalAverageGrade, setGlobalAverageGrade] = useState("0.0");

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("study-planner-token");
      const res = await fetch(`${BASE_URL}/api/Submissions/student-assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Failed to load your study assignments.");
      }

      const allData: any[] = await res.json();

      // Aggregations
      const total = allData.length;
      const completed = allData.filter((a) => a.submission).length;
      const graded = allData.filter((a) => a.submission?.status === "Graded").length;

      setTotalAssignments(total);
      setCompletedSubmissions(completed);
      setGradedCount(graded);

      // Calculate global average grade
      const gradedItems = allData.filter((a) => a.submission?.status === "Graded" && a.submission?.grade);
      if (gradedItems.length > 0) {
        const sum = gradedItems.reduce((acc, item) => acc + item.submission.grade, 0);
        setGlobalAverageGrade((sum / gradedItems.length).toFixed(1));
      } else {
        setGlobalAverageGrade("0.0");
      }

      // Group by subject for subject-wise metrics
      const subjectGroups: Record<string, any[]> = {};
      allData.forEach((item) => {
        const sub = item.assignment.subject || "General";
        if (!subjectGroups[sub]) {
          subjectGroups[sub] = [];
        }
        subjectGroups[sub].push(item);
      });

      const metrics: SubjectMetric[] = Object.keys(subjectGroups).map((subName) => {
        const items = subjectGroups[subName];
        const subTotal = items.length;
        const subCompleted = items.filter((i) => i.submission).length;
        const subGraded = items.filter((i) => i.submission?.status === "Graded" && i.submission?.grade);
        
        let avgGrade = 0;
        if (subGraded.length > 0) {
          avgGrade = subGraded.reduce((acc, i) => acc + i.submission.grade, 0) / subGraded.length;
        }

        return {
          name: subName,
          total: subTotal,
          completed: subCompleted,
          percentage: subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0,
          averageGrade: parseFloat(avgGrade.toFixed(1))
        };
      });

      setSubjectMetrics(metrics);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load study analytics.");
    } finally {
      setLoading(false);
    }
  };

  const overallCompletionRate = totalAssignments > 0 ? Math.round((completedSubmissions / totalAssignments) * 100) : 0;

  // SVG Radial Ring properties
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallCompletionRate / 100) * circumference;

  if (loading) {
    return <div className="analytics-loading">Calculating your progress statistics...</div>;
  }

  if (error) {
    return (
      <div className="analytics-error-pane">
        <FiInfo size={40} color="#ef4444" />
        <p>{error}</p>
        <button onClick={fetchAnalyticsData} className="analytics-btn-retry">Retry</button>
      </div>
    );
  }

  return (
    <div className="global-analytics-container">
      
      {/* Title */}
      <div className="analytics-header-section">
        <h1>Study & Performance Analytics</h1>
        <p>A visual summary of your course progress, task completion metrics, and graded performance.</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="analytics-summary-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper blue">
            <FiBarChart2 size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Assigned Tasks</span>
            <h3 className="kpi-value">{totalAssignments}</h3>
            <span className="kpi-note">Across all courses</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper green">
            <FiCheckCircle size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Completed Tasks</span>
            <h3 className="kpi-value">{completedSubmissions}</h3>
            <span className="kpi-note">{totalAssignments - completedSubmissions} pending tasks</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper gold">
            <FiStar size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Average Rating</span>
            <h3 className="kpi-value">{globalAverageGrade} ★</h3>
            <span className="kpi-note">Based on {gradedCount} grades</span>
          </div>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="analytics-diagrams-grid">
        
        {/* Radial Progress Diagram */}
        <div className="diagram-card main-progress">
          <h3>Overall Course Progress</h3>
          <p className="card-subtitle">Global completion rate of syllabus assignments</p>
          
          <div className="radial-diagram-container">
            <svg width="180" height="180" className="radial-svg">
              <circle cx="90" cy="90" r={radius} stroke="#e2e8f0" strokeWidth="14" fill="transparent" />
              <circle 
                cx="90" cy="90" r={radius} stroke="#4f46e5" strokeWidth="14" fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
              />
            </svg>
            <div className="radial-text">
              <span className="percent-val">{overallCompletionRate}%</span>
              <span className="percent-sub">Syllabus Done</span>
            </div>
          </div>
          
          <div className="radial-legend">
            <div className="legend-item">
              <span className="legend-dot completed"></span>
              <span>Submitted: {completedSubmissions}</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot pending"></span>
              <span>Incomplete: {totalAssignments - completedSubmissions}</span>
            </div>
          </div>
        </div>

        {/* Course-wise Progress Bar Chart */}
        <div className="diagram-card course-progress">
          <h3>Course-wise Progress</h3>
          <p className="card-subtitle">Comparison of task completion rates between active subjects</p>
          
          {subjectMetrics.length === 0 ? (
            <p className="empty-chart-text">Enroll in a class to view subject comparisons.</p>
          ) : (
            <div className="progress-bars-container">
              {subjectMetrics.map((sm) => (
                <div key={sm.name} className="subject-bar-item">
                  <div className="subject-bar-labels">
                    <span className="subject-name">{sm.name}</span>
                    <span className="subject-count">{sm.completed}/{sm.total} ({sm.percentage}%)</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${sm.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Secondary Chart: Grade distributions */}
      <div className="grade-analytics-section">
        <div className="diagram-card full-width">
          <h3>Subject Performance Grades</h3>
          <p className="card-subtitle">Average grade rating out of 5 stars awarded per course</p>
          
          {subjectMetrics.length === 0 ? (
            <p className="empty-chart-text">No grades available to display.</p>
          ) : (
            <div className="grade-bar-chart-container">
              <svg width="100%" height="250" viewBox="0 0 600 250" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                {[1, 2, 3, 4, 5].map((g) => (
                  <g key={g}>
                    <line x1="40" y1={220 - g * 35} x2="580" y2={220 - g * 35} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="15" y={224 - g * 35} fontSize="11" fill="#94a3b8" fontWeight="600">{g}★</text>
                  </g>
                ))}
                
                {/* Subject bars */}
                {subjectMetrics.map((sm, idx) => {
                  const barWidth = 45;
                  const spacing = 520 / Math.max(1, subjectMetrics.length);
                  const x = 50 + idx * spacing;
                  const barHeight = sm.averageGrade * 35;
                  const y = 220 - barHeight;

                  return (
                    <g key={sm.name}>
                      {/* Bar shadow */}
                      <rect x={x} y={y} width={barWidth} height={barHeight} rx="8" fill="#e0e7ff" opacity="0.3" />
                      {/* Interactive Bar */}
                      <rect 
                        x={x} 
                        y={y} 
                        width={barWidth} 
                        height={Math.max(4, barHeight)} 
                        rx="8" 
                        fill="#4f46e5" 
                        className="chart-rect"
                      />
                      {/* Score marker */}
                      <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="#4f46e5">
                        {sm.averageGrade.toFixed(1)}
                      </text>
                      {/* Subject Label */}
                      <text x={x + barWidth / 2} y="240" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
                        {sm.name.length > 10 ? sm.name.substring(0, 10) + ".." : sm.name}
                      </text>
                    </g>
                  );
                })}
                
                {/* Bottom line */}
                <line x1="40" y1="220" x2="580" y2="220" stroke="#cbd5e1" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
