import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './sidebar.css'
import {
  FiHome,
  FiCalendar,
  FiBookOpen,
  FiFolder,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiPlus,
} from 'react-icons/fi'

const MAIN_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/schedule', label: 'Schedule', icon: <FiCalendar /> },
  { to: '/assignments', label: 'Assignments', icon: <FiBookOpen /> },
  { to: '/resource-center', label: 'Resource Center', icon: <FiFolder /> },
  { to: '/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
  { to: '/settings', label: 'Settings', icon: <FiSettings /> },
]

export default function Sidebar(): React.ReactElement {
  const navigate = useNavigate()

  const handleNewTask = () => {
    navigate('/new-task')
  }

  const handleHelpSupport = () => {
    window.open('mailto:support@studyplanner.app')
  }

  const handleLogout = () => {
    window.alert('You have been logged out.')
    navigate('/dashboard')
  }

  return (
    <aside className="sidebar" aria-label="Application sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="sidebar-brand-text">
            <div className="sidebar-title">Smart Study Planner</div>
            <div className="sidebar-subtitle">Higher Ed Portal</div>
          </div>
        </div>

        <button className="sidebar-new-task" type="button" onClick={handleNewTask}>
          <FiPlus />
          <span>New Task</span>
        </button>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          <ul>
            {MAIN_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-nav-button active' : 'sidebar-nav-button'
                  }
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-footer-button" onClick={handleHelpSupport}>
          <FiHelpCircle />
          <span>Help Support</span>
        </button>
        <button type="button" className="sidebar-footer-button" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
