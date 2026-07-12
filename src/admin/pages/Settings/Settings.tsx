import "./Settings.css";

export default function Settings() {
  return (
    <div className="settings-page">

      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account settings.</p>
        </div>

        <button className="save-btn">
          Save Changes
        </button>
      </div>

      <div className="settings-card">

        <h2>Profile Information</h2>

        <div className="form-group">
          <label>Admin Name</label>
          <input
            type="text"
            defaultValue="Admin"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            defaultValue="admin@gmail.com"
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
          />
        </div>

      </div>

    </div>
  );
}