import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiBookOpen, FiClock, FiCalendar, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import "./Dashboard.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5065";

type SubjectInfo = {
  name: string;
  totalAssignments: number;
  completedAssignments: number;
  totalResources: number;
  priorityScore: number;
  priorityLevel: "High" | "Medium" | "Low";
  nearestDeadline: string | null;
  daysToDeadline: number;
  overdueAssignments: number;
  averageGrade: number | null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [classList, setClassList] = useState<string[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("study-planner-token");

      // 1. Fetch student profile
      const profileRes = await fetch(`${BASE_URL}/api/Submissions/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let profile: any = null;
      if (profileRes.ok) {
        profile = await profileRes.json();
      }

      // 2. Fetch assignments + submissions
      const assignRes = await fetch(`${BASE_URL}/api/Submissions/student-assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let allAssignments: any[] = [];
      if (assignRes.ok) {
        allAssignments = await assignRes.json();
      }

      // 3. Fetch resources
      const resRes = await fetch(`${BASE_URL}/api/Resources/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let allResources: any[] = [];
      if (resRes.ok) {
        allResources = await resRes.json();
      }

      // Extract class details from student profile
      if (profile && Array.isArray(profile.classes) && profile.classes.length > 0) {
        setClassList(profile.classes.map((cls: any) => `${cls.className || "Class"} (${cls.semester || ""}${cls.section ? ` ${cls.section}` : ""})`));
      } else if (allAssignments.length > 0 && allAssignments[0].assignment.class) {
        const cls = allAssignments[0].assignment.class;
        setClassList([`${cls.className || "Class"} (${cls.semester || ""}${cls.section ? ` ${cls.section}` : ""})`]);
      }

      // Find all unique subjects
      const subjectNames = new Set<string>();
      allAssignments.forEach((a: any) => subjectNames.add(a.assignment.subject));
      allResources.forEach((r: any) => subjectNames.add(r.subject));

      const now = new Date();
      const compiledSubjects: SubjectInfo[] = Array.from(subjectNames).map((subName) => {
        const subAssignments = allAssignments.filter((a: any) => a.assignment.subject === subName);
        const subResources = allResources.filter((r: any) => r.subject === subName);

        const totalAssign = subAssignments.length;
        const completedAssign = subAssignments.filter((a: any) => a.submission).length;
        const pendingAssign = subAssignments.filter((a: any) => !a.submission);

        // -------------------------------------------------------------
        // PRIORITY SCHEDULING CALCULATIONS
        // -------------------------------------------------------------
        let pDeadline = 0;
        let daysToDeadline = Infinity;
        let nearestDeadlineDate: string | null = null;

        if (pendingAssign.length > 0) {
          pendingAssign.forEach((a: any) => {
            const diffTime = new Date(a.assignment.dueDate).getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < daysToDeadline) {
              daysToDeadline = diffDays;
              nearestDeadlineDate = a.assignment.dueDate;
            }
          });

          // Assignment deadline weighting
          if (daysToDeadline <= 0) {
            pDeadline = 10;
          } else if (daysToDeadline <= 7) {
            pDeadline = 10 - daysToDeadline;
          } else if (daysToDeadline <= 14) {
            pDeadline = 3;
          } else {
            pDeadline = 1;
          }
        }

        // Exam date weighting (loaded from localStorage)
        let pExam = 0;
        const savedExam = localStorage.getItem(`exam-date-${subName.toLowerCase()}`);
        if (savedExam) {
          const diffTime = new Date(savedExam).getTime() - now.getTime();
          const daysToExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (daysToExam <= 0) {
            pExam = 15;
          } else if (daysToExam <= 5) {
            pExam = 15 - daysToExam * 2;
          } else if (daysToExam <= 15) {
            pExam = 8 - daysToExam * 0.4;
          } else if (daysToExam <= 30) {
            pExam = 2;
          } else {
            pExam = 1;
          }
        }

        // Calculate overdue assignments
        const overdueAssign = subAssignments.filter((a: any) => !a.submission && new Date(a.assignment.dueDate).getTime() < now.getTime()).length;

        // Calculate average grade
        const gradedSubmissions = subAssignments.filter((a: any) => a.submission && a.submission.status === "Graded" && a.submission.grade !== null);
        const avgGrade = gradedSubmissions.length > 0
          ? (gradedSubmissions.reduce((sum: number, a: any) => sum + a.submission.grade, 0) / gradedSubmissions.length)
          : null;

        // Base factors
        const pendingFactor = pendingAssign.length * 2.0; 
        const overdueFactor = overdueAssign * 3.5; 
        const completionRateFactor = totalAssign > 0 ? (1 - completedAssign / totalAssign) * 4.0 : 0; 
        const gradeFactor = avgGrade !== null ? (5.0 - avgGrade) * 1.5 : 0; 

        // Keep the deadline and exam weighting
        const deadlineFactor = pDeadline * 0.8;
        const examFactor = pExam * 0.8;

        const totalRaw = pendingFactor + overdueFactor + completionRateFactor + gradeFactor + deadlineFactor + examFactor;
        const finalScore = Math.min(10.0, Math.max(0.5, parseFloat(totalRaw.toFixed(1))));

        let level: "High" | "Medium" | "Low" = "Low";
        if (finalScore >= 7.0) level = "High";
        else if (finalScore >= 4.0) level = "Medium";

        return {
          name: subName,
          totalAssignments: totalAssign,
          completedAssignments: completedAssign,
          totalResources: subResources.length,
          priorityScore: finalScore,
          priorityLevel: level,
          nearestDeadline: nearestDeadlineDate,
          daysToDeadline,
          overdueAssignments: overdueAssign,
          averageGrade: avgGrade
        };
      });

      // Sort subjects by priority score (highest first)
      compiledSubjects.sort((a, b) => b.priorityScore - a.priorityScore);
      setSubjects(compiledSubjects);

      // Extract top 5 upcoming pending deadlines across all subjects
      const pendingDeadlines = allAssignments
        .filter((a: any) => !a.submission)
        .map((a: any) => ({
          id: a.assignment.id,
          title: a.assignment.title,
          subject: a.assignment.subject,
          dueDate: new Date(a.assignment.dueDate)
        }))
        .filter((a: any) => a.dueDate.getTime() > now.getTime())
        .sort((a: any, b: any) => a.dueDate.getTime() - b.dueDate.getTime())
        .slice(0, 5);

      setUpcomingDeadlines(pendingDeadlines);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  const displayName = (() => {
    const rawName = user?.name || user?.email || "student";
    const localPart = rawName.split("@")[0];
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  })();

  const getReasonText = (sub: SubjectInfo) => {
    if (sub.overdueAssignments > 0) {
      return `You have ${sub.overdueAssignments} overdue ${sub.overdueAssignments === 1 ? 'assignment' : 'assignments'} that need immediate submission.`;
    }
    if (sub.averageGrade !== null && sub.averageGrade < 3.0) {
      return `Your current average grade is low (${sub.averageGrade.toFixed(1)}/5 stars). Focusing here will help improve your academic standing.`;
    }
    const pending = sub.totalAssignments - sub.completedAssignments;
    if (pending > 0 && sub.daysToDeadline <= 3) {
      return `An assignment is due in ${sub.daysToDeadline} ${sub.daysToDeadline === 1 ? 'day' : 'days'} (${new Date(sub.nearestDeadline!).toLocaleDateString()}).`;
    }
    if (pending > 0) {
      const completionRate = sub.totalAssignments > 0 ? (sub.completedAssignments / sub.totalAssignments) * 100 : 100;
      return `You have ${pending} pending ${pending === 1 ? 'assignment' : 'assignments'} with a ${Math.round(completionRate)}% completion rate.`;
    }
    const savedExam = localStorage.getItem(`exam-date-${sub.name.toLowerCase()}`);
    if (savedExam) {
      const diffTime = new Date(savedExam).getTime() - new Date().getTime();
      const daysToExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (daysToExam > 0) {
        return `Exam for this subject is approaching in ${daysToExam} days. Start early preparation.`;
      }
    }
    return `Review active course materials and uploaded study resources to stay ahead in class.`;
  };

  const hasPerformanceData = subjects.some(s => s.totalAssignments > 0);
  const focusSubjects = subjects.slice(0, 3);

  if (loading) {
    return <div className="student-loading">Loading student portal...</div>;
  }

  if (error) {
    return (
      <div className="student-error-container">
        <FiAlertCircle size={40} color="#ef4444" />
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="student-btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="student-dashboard-page">

      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div>
          <h1>Welcome back, {displayName}!</h1>
          <p className="subtext">
            {classList.length > 0
              ? `Enrolled in ${classList.join(" | ")}`
              : "Student Portal Dashboard"}
          </p>
        </div>
      </div>

      <div className="dashboard-layout-grid">

        {/* Subjects list */}
        <div className="dashboard-main-section">
          <div className="section-header-title">
            <h2>Your Enrolled Subjects</h2>
            <p>Courses scheduled and active for your class curriculum, sorted by study priority.</p>
          </div>

          {subjects.length === 0 ? (
            <div className="no-data-card">
              <FiBookOpen size={40} color="#cbd5e1" />
              <h3>No Subjects Assigned</h3>
              <p>You have not been assigned to any subjects or classes yet. Please verify your enrollment status with the administrator.</p>
            </div>
          ) : (
            <div className="subjects-cards-grid">
              {subjects.map((sub) => (
                <div
                  key={sub.name}
                  className={`subject-card-item ${sub.priorityLevel.toLowerCase()}`}
                  onClick={() => navigate(`/subject/${encodeURIComponent(sub.name)}`)}
                >
                  <div className="subject-card-header">
                    <h3>{sub.name}</h3>
                    <span className={`priority-badge ${sub.priorityLevel.toLowerCase()}`}>
                      {sub.priorityLevel}
                    </span>
                  </div>

                  <div className="subject-card-body">

                    {/* Priority score */}
                    <div className="priority-score-row">
                      <FiClock size={16} />
                      <strong>Priority Score: {sub.priorityScore}/10</strong>
                    </div>

                    <div className="metrics-summary">
                      <div className="metric">
                        <span className="count">{sub.completedAssignments}/{sub.totalAssignments}</span>
                        <span className="label">Assignments</span>
                      </div>
                      <div className="metric">
                        <span className="count">{sub.totalResources}</span>
                        <span className="label">Resources</span>
                      </div>
                    </div>

                    {/* Nearest deadline */}
                    {sub.nearestDeadline && (
                      <p className="card-deadline-label">
                        <FiCalendar /> Next Due: {new Date(sub.nearestDeadline).toLocaleDateString()}
                      </p>
                    )}

                  </div>

                  <div className="subject-card-footer">
                    <span>View Course Sub-portal</span>
                    <FiArrowRight />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar panel (deadlines & priority schedules details) */}
        <aside className="dashboard-side-section">

          {/* Deadlines card */}
          <div className="side-card">
            <div className="side-card-header">
              <h3>Upcoming Deadlines</h3>
              <FiCalendar />
            </div>

            {upcomingDeadlines.length === 0 ? (
              <p className="side-card-empty">No upcoming assignment deadlines. All clear!</p>
            ) : (
              <div className="deadlines-list-side">
                {upcomingDeadlines.map((dl) => (
                  <div key={dl.id} className="deadline-side-item" onClick={() => navigate(`/subject/${encodeURIComponent(dl.subject)}`)}>
                    <div className="due-day-indicator">
                      <span>{dl.dueDate.getDate()}</span>
                      <span className="month">{dl.dueDate.toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    </div>
                    <div className="details">
                      <h4>{dl.title}</h4>
                      <p>{dl.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick study recommendation based on priority */}
          {subjects.length > 0 && (
            <div className="side-card recommendation-box">
              <div className="rec-header">
                <FiAlertCircle size={20} />
                <h3>Focus Subjects</h3>
              </div>
              
              {!hasPerformanceData && (
                <p className="rec-fallback-text">
                  More study data is needed to generate personalized recommendations.
                </p>
              )}

              <div className="rec-subjects-list">
                {focusSubjects.map((sub) => (
                  <div key={sub.name} className="rec-subject-item">
                    <div className="rec-subject-info">
                      <h4>{sub.name}</h4>
                      <span className={`priority-badge ${sub.priorityLevel.toLowerCase()}`}>
                        {sub.priorityLevel}
                      </span>
                    </div>
                    <p className="rec-reason">{getReasonText(sub)}</p>
                    <button
                      className="student-btn-primary rec-btn"
                      onClick={() => navigate(`/subject/${encodeURIComponent(sub.name)}`)}
                    >
                      Go to Subject Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </aside>

      </div>

    </div>
  );
}
