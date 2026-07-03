import '../../App.css'
import { useState, type FormEvent } from 'react'
import '../../App.css'
import './Settings.css'

export default function Settings() {
  const [studentName, setStudentName] = useState('Neha Morgan')
  const [email, setEmail] = useState('neha@student.edu')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [theme, setTheme] = useState('Light')
  const [language, setLanguage] = useState('English')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <section className="settings-page">
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="card card-white settings-card">
          <div className="card-title">Profile Settings</div>
          <div className="settings-field">
            <label htmlFor="student-name">Student Name</label>
            <input
              id="student-name"
              type="text"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
            />
          </div>
          <div className="settings-field">
            <label htmlFor="student-email">Email</label>
            <input
              id="student-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="settings-field settings-checkbox-field">
            <label htmlFor="notifications-enabled">Notifications</label>
            <input
              id="notifications-enabled"
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(event) => setNotificationsEnabled(event.target.checked)}
            />
          </div>
        </div>

        <div className="card card-white settings-card">
          <div className="card-title">App Preferences</div>
          <div className="settings-field">
            <label htmlFor="app-theme">Theme</label>
            <select id="app-theme" value={theme} onChange={(event) => setTheme(event.target.value)}>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
          <div className="settings-field">
            <label htmlFor="app-language">Language</label>
            <select id="app-language" value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="btn-primary">
            Save Settings
          </button>
          {saved ? <span className="settings-saved">Settings saved.</span> : null}
        </div>
      </form>
    </section>
  )
}
