import { useNavigate } from 'react-router-dom'
import '../styles/RoleSelector.css'

function SysadminIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7a9b8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function TeacherIcon() {
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

  const handleRoleSelect = (role: 'sysadmin' | 'admin' | 'student') => {
    if (role === 'sysadmin') {
      navigate('/sysadmin-signup')
    } else if (role === 'admin') {
      navigate('/admin-signup')
    } else {
      navigate('/student-signup')
    }
  }

  return (
    <div className="role-selector-page">
      <div className="role-selector-card" style={{ maxWidth: '800px' }}>
        <div className="role-selector-heading">
          <h1>Smart Study Planner</h1>
          <p>Choose your role to get started</p>
        </div>

        <div className="role-options">
          <button
            className="role-button admin-button"
            onClick={() => handleRoleSelect('sysadmin')}
          >
            <div className="role-icon">
              <SysadminIcon />
            </div>
            <h2>Admin</h2>
            <p>Manage system, users, & classes</p>
          </button>

          <button
            className="role-button admin-button"
            onClick={() => handleRoleSelect('admin')}
          >
            <div className="role-icon">
              <TeacherIcon />
            </div>
            <h2>Teacher</h2>
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
