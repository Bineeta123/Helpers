import { useEffect, useState } from "react";
import "./Settings.css";

export default function Settings() {
  const [adminName, setAdminName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Change this to the email of the currently logged-in admin.
  // Later, you can get it from your login/auth context.
  const currentEmail = "Sir@hod.ncit.edu.np";

  useEffect(() => {
    fetch(`https://localhost:7161/api/Settings/${encodeURIComponent(currentEmail)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load settings.");
        }
        return res.json();
      })
      .then((data) => {
        setEmail(data.email);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `https://localhost:7161/api/Settings/${encodeURIComponent(currentEmail)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
          <label>Admin Name</label>
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