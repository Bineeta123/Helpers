import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './sidebar.css'
import {
  FiHome,
  FiBookOpen,
  FiFolder,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'

const MAIN_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/assignments', label: 'Assignments', icon: <FiBookOpen /> },
  { to: '/resource-center', label: 'Resource Center', icon: <FiFolder /> },
  { to: '/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
  { to: '/settings', label: 'Settings', icon: <FiSettings /> },
]

export default function Sidebar(): React.ReactElement {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <aside className="sidebar" aria-label="Application sidebar">
      <div className="sidebar-brand">
        <h2>Smart Study Planner</h2>
        <p>Student Portal</p>
      </div>

      <nav className="sidebar-menu" aria-label="Primary navigation">
        {MAIN_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'sidebar-menu-item active' : 'sidebar-menu-item'
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">      
        <button type="button" className="logout-button" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>   
      </div>
    </aside>
  )
}
