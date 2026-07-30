import { useEffect, useState } from "react";
import { AdminDashboardService } from "../api/adminApi";
import { FiUsers, FiBookOpen, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await AdminDashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="sysadmin-page-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
        
        <div className="sysadmin-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#e0e7ff", color: "#4f46e5", borderRadius: "12px" }}>
            <FiUsers size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "2rem", color: "#1e293b" }}>{stats?.totalStudents || 0}</h3>
            <p style={{ margin: 0, color: "#64748b", fontWeight: 500 }}>Total Students</p>
          </div>
        </div>

        <div className="sysadmin-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#dcfce7", color: "#16a34a", borderRadius: "12px" }}>
            <FaChalkboardTeacher size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "2rem", color: "#1e293b" }}>{stats?.totalTeachers || 0}</h3>
            <p style={{ margin: 0, color: "#64748b", fontWeight: 500 }}>Total Teachers</p>
          </div>
        </div>

        <div className="sysadmin-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#fef08a", color: "#ca8a04", borderRadius: "12px" }}>
            <FiBookOpen size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "2rem", color: "#1e293b" }}>{stats?.totalClasses || 0}</h3>
            <p style={{ margin: 0, color: "#64748b", fontWeight: 500 }}>Total Classes</p>
          </div>
        </div>


        <div className="sysadmin-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#cffafe", color: "#0891b2", borderRadius: "12px" }}>
            <FiCheckCircle size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "2rem", color: "#1e293b" }}>{stats?.activeUsers || 0}</h3>
            <p style={{ margin: 0, color: "#64748b", fontWeight: 500 }}>Active Users</p>
          </div>
        </div>

        <div className="sysadmin-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#fee2e2", color: "#dc2626", borderRadius: "12px" }}>
            <FiXCircle size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "2rem", color: "#1e293b" }}>{stats?.inactiveUsers || 0}</h3>
            <p style={{ margin: 0, color: "#64748b", fontWeight: 500 }}>Inactive Users</p>
          </div>
        </div>

      </div>

      <div className="sysadmin-card" style={{ marginTop: "2rem" }}>
        <h2>System Activities</h2>
        <p style={{ color: "#64748b" }}>Recent system activities will appear here.</p>
      </div>
    </div>
  );
}
