import "./AdminDashboard.css";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { useAuth } from "../../../context/AuthContext";





export default function AdminDashboard()
{
const { user } = useAuth()
 const adminUser = (() => {
    const rawName = user?.name || user?.email || 'student'
    const localPart = rawName.split('@')[0]
    const firstSegment = localPart.split('.')[0] || localPart
    return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1)
  })()


  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Hello, {adminUser}👋</h1>
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
