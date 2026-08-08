import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "http://localhost:5065";

export default function Settings() {
  const { user } = useAuth();
  
  // Admin profile state
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // System settings state
  const [collegeName, setCollegeName] = useState("");
  
  const [loading, setLoading] = useState(true);

  const currentEmail = user?.email;

  useEffect(() => {
    if (!currentEmail) return;

    // Load admin profile and school name in parallel
    Promise.all([
      fetch(`${API_BASE}/api/Settings/${encodeURIComponent(currentEmail)}`).then(res => res.ok ? res.json() : null),
      fetch(`${API_BASE}/api/Settings/school`).then(res => res.ok ? res.json() : null)
    ])
      .then(([profileData, schoolData]) => {
        if (profileData) {
          setEmail(profileData.email || "");
          setAdminName(profileData.name || "System Admin");
        }
        if (schoolData) {
          setCollegeName(schoolData.name || "");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [currentEmail]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmail) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/Settings/${encodeURIComponent(currentEmail)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: adminName,
            email,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        alert("Failed to update profile settings.");
        return;
      }

      alert("Admin profile updated successfully.");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong updating profile.");
    }
  };

  const handleSaveSystem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE}/api/Settings/school`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: collegeName
          }),
        }
      );

      if (!response.ok) {
        alert("Failed to update system settings.");
        return;
      }

      alert("System settings updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong updating system settings.");
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}><p>Loading settings...</p></div>;
  }

  return (
    <div>
      <div className="sysadmin-page-header">
        <h1>Settings</h1>
      </div>

      <div className="sysadmin-card">
        <h3>Admin Profile</h3>
        <p style={{ color: "#64748b" }}>Update your profile information here.</p>
        
        <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", marginTop: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#475569", fontWeight: 500 }}>Full Name</label>
            <input 
              type="text" 
              value={adminName} 
              onChange={(e) => setAdminName(e.target.value)} 
              placeholder="Admin Name" 
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#475569", fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@example.com" 
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#475569", fontWeight: 500 }}>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="••••••••" 
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} 
            />
          </div>
          <button type="submit" className="sysadmin-btn-primary" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
            Save Changes
          </button>
        </form>
      </div>

      <div className="sysadmin-card" style={{ marginTop: "1.5rem" }}>
        <h3>System Settings</h3>
        <p style={{ color: "#64748b" }}>Configure global system settings.</p>
        
        <form onSubmit={handleSaveSystem} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", marginTop: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#475569", fontWeight: 500 }}>College Name</label>
            <input 
              type="text" 
              value={collegeName} 
              onChange={(e) => setCollegeName(e.target.value)} 
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} 
            />
          </div>
          <button type="submit" className="sysadmin-btn-primary" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
            Update Settings
          </button>
        </form>
      </div>
    </div>
  );
}
