import "./SysadminSidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiFolder,
  FiSettings,
  FiLogOut,
  FiCheckSquare
} from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";

const menuItems = [
  { title: "Dashboard", icon: <FiHome />, path: "" },
  { title: "Teachers", icon: <FaChalkboardTeacher />, path: "teachers" },
  { title: "Students", icon: <FiUsers />, path: "students" },
  { title: "Classes", icon: <FiBookOpen />, path: "classes" },
  { title: "Authorized Users", icon: <FiFolder />, path: "authorized-users" },
  { title: "Registrations", icon: <FiCheckSquare />, path: "registrations" },
  { title: "Settings", icon: <FiSettings />, path: "settings" },
];

export default function SysadminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <aside className="sysadmin-sidebar">
      <div className="sysadmin-logo">
        <h2>Study Planner</h2>
        <p>Admin Control Panel</p>
      </div>

      <nav className="sysadmin-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={`/sysadmin/${item.path}`}
            className={({ isActive }) =>
              isActive ? "sysadmin-menu-item active" : "sysadmin-menu-item"
            }
            end={item.path === ""}
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sysadmin-footer">
        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
