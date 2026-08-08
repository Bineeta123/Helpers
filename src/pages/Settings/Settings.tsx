import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Settings.css'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "http://localhost:5065";

export default function Settings() {
  const { user } = useAuth()
  const [studentName, setStudentName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(true)

  const currentEmail = user?.email;

  useEffect(() => {
    if (!currentEmail) return;

    fetch(`${API_BASE}/api/Settings/${encodeURIComponent(currentEmail)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load settings.");
        return res.json();
      })
      .then((data) => {
        setStudentName(data.name || '');
        setEmail(data.email || '');
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
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: studentName,
            email,
            newPassword,
          }),
        }
      )

      if (!response.ok) {
        alert('Failed to update settings.')
        return
      }

      alert('Settings updated successfully.')
      setNewPassword('')
    } catch (error) {
      console.error(error)
      alert('Something went wrong.')
    }
  }

  if (loading) {
    return <section className="settings-page"><p>Loading settings...</p></section>;
  }

  return (
    <section className="settings-page">
      <div className="settings-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', maxWidth: '560px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Settings</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)' }}>Manage your account details.</p>
        </div>
        <button className="save-btn" onClick={handleSave} style={{
          padding: '10px 20px',
          background: 'var(--color-primary-600)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          fontWeight: 600,
          transition: 'all var(--transition-fast)'
        }}>
          Save Changes
        </button>
      </div>

      <div className="settings-card">
        <label className="settings-field">
          <span>Student Name</span>
          <input value={studentName} onChange={(event) => setStudentName(event.target.value)} />
        </label>

        <label className="settings-field" style={{ marginTop: '16px' }}>
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>

        <label className="settings-field" style={{ marginTop: '16px' }}>
          <span>New Password</span>
          <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Enter new password" />
        </label>
      </div>
    </section>
  )
}
