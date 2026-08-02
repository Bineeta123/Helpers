import { useEffect, useState } from "react";
import { RegistrationsService } from "../api/adminApi";
import { FiCheck, FiX } from "react-icons/fi";

export default function Registrations() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await RegistrationsService.getRequests();
      setRequests(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await RegistrationsService.approve(id);
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await RegistrationsService.reject(id);
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="sysadmin-page-header">
        <h1>Registration Requests</h1>
      </div>

      <div className="sysadmin-card">
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "1rem" }}>User Name</th>
              <th style={{ padding: "1rem" }}>Email</th>
              <th style={{ padding: "1rem" }}>Role</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem" }}>Request Date</th>
              <th style={{ padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "1rem", fontWeight: 500 }}>{r.authorizedUser?.name}</td>
                <td style={{ padding: "1rem", color: "#64748b" }}>{r.authorizedUser?.email}</td>
                <td style={{ padding: "1rem" }}>{r.authorizedUser?.role}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    background: r.status === "Approved" ? "#dcfce7" : r.status === "Rejected" ? "#fee2e2" : "#fef08a", 
                    color: r.status === "Approved" ? "#16a34a" : r.status === "Rejected" ? "#dc2626" : "#ca8a04", 
                    padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600 }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: "1rem", color: "#64748b" }}>{new Date(r.requestDate).toLocaleDateString()}</td>
                <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                  {r.status === "Pending" && (
                    <>
                      <button onClick={() => handleApprove(r.id)} style={{ color: "#16a34a", background: "#dcfce7", border: "none", cursor: "pointer", padding: "0.5rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <FiCheck size={16} /> Approve
                      </button>
                      <button onClick={() => handleReject(r.id)} style={{ color: "#dc2626", background: "#fee2e2", border: "none", cursor: "pointer", padding: "0.5rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <FiX size={16} /> Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No registration requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
