import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import Students from "./pages/Students/Students";
import Assignments from "./pages/Assignments/Assignments";
import Resources from "./pages/Resources/Resources";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

export default function AdminApp() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="resources" element={<Resources />} />
        <Route path="reports/:studentId" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}
