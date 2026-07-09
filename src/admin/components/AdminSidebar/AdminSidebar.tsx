import "./AdminSidebar.css";
import { useAuth } from "../../../context/AuthContext";
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiFolder,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const menuItems = [
  {
    title: "Dashboard",
    icon: <FiHome />,
  },
  {
    title: "Students",
    icon: <FiUsers />,
  },
  {
    title: "Assignments",
    icon: <FiBookOpen />,
  },
  {
    title: "Resources",
    icon: <FiFolder />,
  },
  {
    title: "Reports",
    icon: <FiBarChart2 />,
  },
  {
    title: "Settings",
    icon: <FiSettings />,
  },
];

export default function AdminSidebar() {
 const { user, logout } = useAuth()
 const navigate = useNavigate()
 

  const handleLogout = () => {
   logout()
    navigate('/login')
  }
 

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-logo">
          <h2>Study Planner</h2>
          <p>Admin Portal</p>
        </div>

        <nav className="admin-menu">
          {menuItems.map((item) => (
            <button key={item.title} className="admin-menu-item">
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </nav>
      </div>

     <button type="button" className="sidebar-footer-button" onClick={handleLogout}>
      <FiLogOut />
      <span>Logout</span>
     </button>   
    </aside>
  );
}