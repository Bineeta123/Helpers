import { Routes, Route, Navigate } from "react-router-dom";
import SysadminLayout from "./layout/SysadminLayout";
import Dashboard from "./pages/Dashboard";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import AuthorizedUsers from "./pages/AuthorizedUsers";
import Registrations from "./pages/Registrations";
import AcademicYears from "./pages/AcademicYears";
import Settings from "./pages/Settings";

export default function SysadminApp() {
  return (
    <Routes>
      <Route element={<SysadminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="students" element={<Students />} />
        <Route path="classes" element={<Classes />} />
        <Route path="authorized-users" element={<AuthorizedUsers />} />
        <Route path="registrations" element={<Registrations />} />
        <Route path="academic-years" element={<AcademicYears />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}
