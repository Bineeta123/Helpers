import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import { useAuth } from "../../../context/AuthContext";

interface Activity {
  id: number;
  description: string;
  time: string;
}

interface Deadline {
  id: number;
  title: string;
  date: string;
}

interface AdminStats {
  totalStudents: number;
  totalClasses: number;
  totalAssignments: number;
  totalResources: number;
  pendingGrading: number;
  activeStudents: number;
  gradedSubmissions: number;
  totalSubmissions: number;
  mostActiveClass: string;
  completionRate: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const adminUser = (() => {
    const rawName = user?.name || user?.email || "Admin";
    const localPart = rawName.split("@")[0];
    const firstSegment = localPart.split(".")[0] || localPart;
    return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
  })();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "http://localhost:5065";

    fetch(`${apiBase}/api/AdminDashboard/teacher-stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("study-planner-token")}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        setStats({
          totalStudents: data.totalStudents,
          totalClasses: data.totalClasses,
          totalAssignments: data.totalAssignments,
          totalResources: data.totalResources,
          pendingGrading: data.pendingGrading,
          activeStudents: data.activeStudents,
          gradedSubmissions: data.gradedSubmissions,
          totalSubmissions: data.totalSubmissions,
          mostActiveClass: data.mostActiveClass,
          completionRate: data.completionRate,
        });
        setActivities(data.activities || []);
        setDeadlines(data.upcomingDeadlines || []);
      })
      .catch(() => {
        setStats({
          totalStudents: 0,
          totalClasses: 0,
          totalAssignments: 0,
          totalResources: 0,
          pendingGrading: 0,
          activeStudents: 0,
          gradedSubmissions: 0,
          totalSubmissions: 0,
          mostActiveClass: "None",
          completionRate: 0,
        });
        setActivities([
          {
            id: 1,
            description: "Student submitted Web Technology Assignment",
            time: "10 mins ago",
          },
          {
            id: 2,
            description: "New study resource uploaded",
            time: "45 mins ago",
          },
          {
            id: 3,
            description: "New student registered",
            time: "2 hours ago",
          },
          {
            id: 4,
            description: "Assignment deadline updated",
            time: "Today",
          },
        ]);
        setDeadlines([
          {
            id: 1,
            title: "Database Lab Report",
            date: "15 Jul",
          },
          {
            id: 2,
            title: "Computer Networks Quiz",
            date: "18 Jul",
          },
          {
            id: 3,
            title: "Software Engineering Presentation",
            date: "22 Jul",
          },
          {
            id: 4,
            title: "Web Technology Project",
            date: "25 Jul",
          },
        ]);
      });
  }, []);

  const getInsights = () => {
    if (!stats) return ["Loading insights..."];

    const hasData = stats.totalStudents > 0 || stats.totalClasses > 0 || stats.totalAssignments > 0 || stats.totalResources > 0;

    if (!hasData) {
      return [
        "No study data available yet. Start by adding students, classes, assignments, or resources to view insights."
      ];
    }

    const insightsList: string[] = [];

    // Total assignments created
    insightsList.push(`Total of ${stats.totalAssignments} ${stats.totalAssignments === 1 ? 'assignment has' : 'assignments have'} been created.`);

    // Pending grading
    if (stats.pendingGrading > 0) {
      insightsList.push(`${stats.pendingGrading} ${stats.pendingGrading === 1 ? 'assignment is' : 'assignments are'} currently pending grading.`);
    } else {
      insightsList.push("All submitted assignments have been graded.");
    }

    // Completed/Graded assignments
    if (stats.gradedSubmissions > 0) {
      insightsList.push(`${stats.gradedSubmissions} ${stats.gradedSubmissions === 1 ? 'assignment has' : 'assignments have'} been graded.`);
    }

    // Active students
    if (stats.activeStudents > 0) {
      insightsList.push(`${stats.activeStudents} active ${stats.activeStudents === 1 ? 'student is' : 'students are'} enrolled in your classes.`);
    } else {
      insightsList.push("No active students enrolled in your classes yet.");
    }

    // Most active class
    if (stats.mostActiveClass && stats.mostActiveClass !== "None") {
      insightsList.push(`${stats.mostActiveClass} is the most active class based on submissions.`);
    }

    // Resources uploaded
    if (stats.totalResources > 0) {
      insightsList.push(`${stats.totalResources} study ${stats.totalResources === 1 ? 'resource is' : 'resources are'} available.`);
    } else {
      insightsList.push("No study resources have been uploaded yet.");
    }

    // Assignment completion rate
    if (stats.totalAssignments > 0 && stats.totalStudents > 0) {
      insightsList.push(`${stats.completionRate}% of expected assignments have been completed.`);
    }

    return insightsList;
  };

  return (
    <div className="admin-dashboard">
      <main className="admin-dashboard-content">

        <div className="dashboard-header">
          <h1>Hello, {adminUser} 👋</h1>
          <p>Manage students, assignments and resources from one place.</p>
        </div>

        <div className="summary-cards">
          <SummaryCard title="Students" value={stats?.totalStudents ?? 0} />
          <SummaryCard title="Classes" value={stats?.totalClasses ?? 0} />
          <SummaryCard title="Assignments" value={stats?.totalAssignments ?? 0} />
          <SummaryCard title="Resources" value={stats?.totalResources ?? 0} />
        </div>

        <div className="admin-dashboard-grid">

          <div className="dashboard-card recent-activity-card">
            <h2>Recent Activity</h2>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div className="activity-item" key={activity.id}>
                  <div>
                    <strong>{activity.description}</strong>
                    <p>{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state-text">No recent activity found.</p>
            )}
          </div>

          <div className="dashboard-sidebar-stack">
            <div className="dashboard-card">
              <h2>Upcoming Deadlines</h2>
              {deadlines.length > 0 ? (
                deadlines.map((deadline) => (
                  <div className="deadline-item" key={deadline.id}>
                    <span>{deadline.title}</span>
                    <strong>{deadline.date}</strong>
                  </div>
                ))
              ) : (
                <p className="empty-state-text">No upcoming deadlines.</p>
              )}
            </div>

            <div className="dashboard-card">
              <h2>Study Insights</h2>
              <ul className="insight-list">
                {getInsights().map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
