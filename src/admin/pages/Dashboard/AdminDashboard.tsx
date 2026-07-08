import "./AdminDashboard.css";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, Admin 👋</h1>
          <p>Manage students, assignments and resources from one place.</p>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Students</h3>
            <h2>128</h2>
          </div>

          <div className="summary-card">
            <h3>Assignments</h3>
            <h2>24</h2>
          </div>

          <div className="summary-card">
            <h3>Pending</h3>
            <h2>18</h2>
          </div>

          <div className="summary-card">
            <h3>Completed</h3>
            <h2>106</h2>
          </div>
        </div>
      </main>
    </div>
  );
}