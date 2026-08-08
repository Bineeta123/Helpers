import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./Settings.css";

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "http://localhost:5065";

export default function Settings() {
  const { user } = useAuth();
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const currentEmail = user?.email;

  useEffect(() => {
    if (!currentEmail) return;

    fetch(`${API_BASE}/api/Settings/${encodeURIComponent(currentEmail)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load settings.");
        }
        return res.json();
      })
      .then((data) => {
        setEmail(data.email || "");
        setAdminName(data.name || "Teacher");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [currentEmail]);

  const handleSave = async () => {
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

      const result = await response.json();

      if (!response.ok) {
        alert("Failed to update settings.");
        console.log(result);
        return;
      }

      alert("Settings updated successfully.");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  if (loading) {
    return <div className="settings-page"><p>Loading settings...</p></div>;
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account settings.</p>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      <div className="settings-card">
        <h2>Profile Information</h2>

        <div className="form-group">
          <label>Teacher Name</label>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
      </div>
    </div>
  );
}