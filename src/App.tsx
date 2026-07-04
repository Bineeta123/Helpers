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
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'
import UserDashboard from './components/UserDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function HomeRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute>
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
      <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/schedule" element={<MainLayout><Schedule /></MainLayout>} />
      <Route path="/assignments" element={<MainLayout><Assignments /></MainLayout>} />
      <Route path="/new-task" element={<MainLayout><NewTask /></MainLayout>} />
      <Route path="/resource-center" element={<MainLayout><ResourceCenter /></MainLayout>} />
      <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
      <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
