import { Outlet } from "react-router-dom";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import "./AdminLayout.css";

export default function AdminLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">

      <button
        className="menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FiMenu />
      </button>

      <div
  className={sidebarOpen ? "sidebar show" : "sidebar"}
  onClick={() => setSidebarOpen(false)}
>
  <AdminSidebar  />
</div>

{sidebarOpen && (
  <div
    className="overlay"
    onClick={() => setSidebarOpen(false)}
  />
)}

<main className="admin-main">
  <Outlet />
</main>
    </div>
  );
}