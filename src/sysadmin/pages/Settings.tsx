export default function Settings() {
  return (
    <div>
      <div className="sysadmin-page-header">
        <h1>Settings</h1>
      </div>

      <div className="sysadmin-card">
        <h3>Admin Profile</h3>
        <p style={{ color: "#64748b" }}>Update your profile information here.</p>
        
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", marginTop: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#475569", fontWeight: 500 }}>Full Name</label>
            <input type="text" placeholder="Admin Name" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#475569", fontWeight: 500 }}>Email Address</label>
            <input type="email" placeholder="admin@example.com" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#475569", fontWeight: 500 }}>New Password</label>
            <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>
          <button type="button" className="sysadmin-btn-primary" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
            Save Changes
          </button>
        </form>
      </div>

      <div className="sysadmin-card" style={{ marginTop: "1.5rem" }}>
        <h3>System Settings</h3>
        <p style={{ color: "#64748b" }}>Configure global system settings.</p>
        
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", marginTop: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#475569", fontWeight: 500 }}>College Name</label>
            <input type="text" defaultValue="Smart Study Planner Institute" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
          </div>
          <button type="button" className="sysadmin-btn-primary" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
            Update Settings
          </button>
        </form>
      </div>
    </div>
  );
}
