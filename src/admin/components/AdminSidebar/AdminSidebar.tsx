import "./AdminSidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiFolder,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const menuItems = [
  { title: "Dashboard", icon: <FiHome />, path: "" },
  { title: "Students", icon: <FiUsers />, path: "students" },
  { title: "Assignments", icon: <FiBookOpen />, path: "assignments" },
  { title: "Resources", icon: <FiFolder />, path: "resources" },
  { title: "Settings", icon: <FiSettings />, path: "settings" },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-logo">
          <h2>Study Planner</h2>
          <p>Teacher Portal</p>
        </div>

        <nav className="admin-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={`/admin/${item.path}`}
              className={({ isActive }) =>
                isActive ? "admin-menu-item active" : "admin-menu-item"
              }
              end={item.path === ""}
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    </aside>
  );
}
