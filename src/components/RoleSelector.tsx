import { useNavigate } from 'react-router-dom'
import '../styles/RoleSelector.css'

function AdminIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="10" r="4.5" fill="#7a9b8f" />
      <path d="M8 17h12c2.5 0 4 2 4 4.5v14H4V21.5c0-2.5 1.5-4.5 4-4.5z" fill="#7a9b8f" />
      <rect x="22" y="8" width="20" height="5" rx="1.5" fill="#7a9b8f" opacity="0.2" />
      <rect x="22" y="16" width="20" height="5" rx="1.5" fill="#7a9b8f" opacity="0.5" />
      <rect x="22" y="24" width="20" height="5" rx="1.5" fill="#7a9b8f" />
    </svg>
  )
}

function StudentIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L6 12V20C6 32 24 40 24 40C24 40 42 32 42 20V12L24 4Z" fill="#7a9b8f" strokeWidth="0" />
      <circle cx="24" cy="20" r="2.5" fill="white" />
      <rect x="20" y="26" width="8" height="6" rx="1" fill="white" opacity="0.9" />
    </svg>
  )
}

export default function RoleSelector() {
  const navigate = useNavigate()

  const handleRoleSelect = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      navigate('/admin-signup')
    } else {
      navigate('/student-signup')
    }
  }

  return (
    <div className="role-selector-page">
      <div className="role-selector-card">
        <div className="role-selector-heading">
          <h1>Smart Study Planner</h1>
          <p>Choose your role to get started</p>
        </div>

        <div className="role-options">
          <button
            className="role-button admin-button"
            onClick={() => handleRoleSelect('admin')}
          >
            <div className="role-icon">
              <AdminIcon />
            </div>
            <h2>Admin</h2>
            <p>Manage courses and students</p>
          </button>

          <button
            className="role-button student-button"
            onClick={() => handleRoleSelect('student')}
          >
            <div className="role-icon">
              <StudentIcon />
            </div>
            <h2>Student</h2>
            <p>Access your study plans</p>
          </button>
        </div>

        <div className="role-selector-footer">
          <p>Already have an account? <a href="/signin">Sign in</a></p>
        </div>
      </div>
    </div>
  )
}
