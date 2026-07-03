import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Student dashboard</p>
          <h1>Welcome, {user?.email}</h1>
        </div>
        <button className="secondary-button" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <section className="dashboard-section">
        <h2>Your tasks</h2>
        <ul>
          <li>Open upcoming assignment list</li>
          <li>View your schedule</li>
          <li>Check learning resources</li>
        </ul>
      </section>

      <section className="dashboard-section">
        <h2>Status</h2>
        <p></p>
      </section>
    </div>
  )
}
