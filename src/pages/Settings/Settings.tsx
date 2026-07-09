import { useState } from 'react'
import './Settings.css'

export default function Settings() {
  const [studentName, setStudentName] = useState('Bineeta')
  const [email, setEmail] = useState('bineeta@ncit.edu.np')

  return (
    <section className="settings-page">
      <div className="settings-card">
        <h1>Settings</h1>
        <p>Manage your account details.</p>

        <label className="settings-field">
          <span>Student Name</span>
          <input value={studentName} onChange={(event) => setStudentName(event.target.value)} />
        </label>

        <label className="settings-field">
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
      </div>
    </section>
  )
}
