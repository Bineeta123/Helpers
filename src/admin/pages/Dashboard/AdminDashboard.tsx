import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
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

  useEffect(() => {
    fetch("http://localhost:5065/api/activity")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch(() => {
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
      });

    fetch("http://localhost:5065/api/deadlines")
      .then((res) => res.json())
      .then((data) => setDeadlines(data))
      .catch(() => {
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

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <main className="admin-dashboard-content">

        <div className="dashboard-header">
          <h1>Hello, {adminUser} 👋</h1>
          <p>Manage students, assignments and resources from one place.</p>
        </div>

        <div className="summary-cards">
          <SummaryCard title="Total Students" value={128} />
          <SummaryCard title="Pending Assignments" value={18} />
          <SummaryCard title="Resources" value={42} />
          <SummaryCard title="Upcoming Deadlines" value={3} />
        </div>

        {/* Row 1 */}

        <div className="admin-dashboard-grid">

          <div className="dashboard-card">

            <h2>Recent Activity</h2>

            {activities.map((activity) => (
              <div
                className="activity-item"
                key={activity.id}
              >
                <div>
                  <strong>{activity.description}</strong>
                  <p>{activity.time}</p>
                </div>
              </div>
            ))}

          </div>

          <div className="dashboard-card">

            <h2>Upcoming Deadlines</h2>

            {deadlines.map((deadline) => (
              <div
                className="deadline-item"
                key={deadline.id}
              >
                <span>{deadline.title}</span>
                <strong>{deadline.date}</strong>
              </div>
            ))}

          </div>

        </div>

        {/* Row 2 */}

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>Quick Actions</h2>

            <div className="quick-actions">

              <button className="action-btn">
                Add Student
              </button>

              <button className="action-btn">
                Upload Resource
              </button>

              <button className="action-btn">
                Create Assignment
              </button>

            </div>

          </div>

          <div className="dashboard-card">

            <h2>Study Insights</h2>

            <ul className="insight-list">
              <li>18 assignments are currently pending.</li>
              <li>Database is the most active subject this week.</li>
              <li>75% of assignments have been completed.</li>
              <li>42 study resources are available.</li>
            </ul>

          </div>

        </div>

      </main>

    </div>
  );
}
