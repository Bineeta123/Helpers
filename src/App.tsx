import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Schedule from './pages/Schedule/Schedule'
import Assignments from './pages/Assignments/Assignments'
import NewTask from './pages/NewTask/NewTask'
import ResourceCenter from './pages/ResourceCenter/ResourceCenter'
import Analytics from './pages/Analytics/Analytics'
import Settings from './pages/Settings/Settings'
import RoleSelector from './components/RoleSelector'
import StudentSignup from './components/StudentSignup'
import AdminSignup from './components/AdminSignup'
import SignIn from './components/SignIn'
import AdminDashboard from './components/AdminDashboard'
import UserDashboard from './components/UserDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function HomeRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/role-selector" replace />
  }

  return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/role-selector" element={<RoleSelector />} />
      <Route path="/student-signup" element={<StudentSignup />} />
      <Route path="/admin-signup" element={<AdminSignup />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/new-task" element={<NewTask />} />
        <Route path="/resource-center" element={<ResourceCenter />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
