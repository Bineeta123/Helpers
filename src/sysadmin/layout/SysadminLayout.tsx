import { Outlet } from "react-router-dom";
import SysadminSidebar from "../components/SysadminSidebar/SysadminSidebar";
import "./SysadminLayout.css";

export default function SysadminLayout() {
  return (
    <div className="sysadmin-layout">
      <SysadminSidebar />
      <main className="sysadmin-main-content">
        <Outlet />
      </main>
    </div>
  );
}
