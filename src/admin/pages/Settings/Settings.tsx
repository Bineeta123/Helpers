import "./Settings.css";

export default function Settings() {
  return (
    <div className="settings-page">

      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage administrator preferences.</p>
      </div>

      <div className="settings-card">

        <div className="setting-item">
          <label>Administrator Name</label>
          <input
            type="text"
            placeholder="Admin Name"
          />
        </div>

        <div className="setting-item">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="admin@example.com"
          />
        </div>

        <div className="setting-item">
          <label>Change Password</label>
          <input
            type="password"
            placeholder="********"
          />
        </div>

        <button className="save-btn">
          Save Changes
        </button>

      </div>

    </div>
  );
}