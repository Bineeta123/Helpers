import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Assignments from './pages/Assignments/Assignments'
import NewTask from './pages/NewTask/NewTask'
import ResourceCenter from './pages/ResourceCenter/ResourceCenter'
import Analytics from './pages/Analytics/Analytics'
import Settings from './pages/Settings/Settings'
import SubjectDetails from './pages/SubjectDetails/SubjectDetails'
import RoleSelector from './components/RoleSelector'
import StudentSignup from './components/StudentSignup'
import AdminSignup from './components/AdminSignup'
import SysadminSignup from './components/SysadminSignup'
import SetupPage from './components/SetupPage'
import LandingPage from './components/LandingPage'
import SignIn from './components/SignIn'
// import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import AdminApp from "./admin/AdminApp";
import SysadminApp from "./sysadmin/SysadminApp";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:5065'
).replace(/\/$/, '')

function HomeRedirect() {
  const { user } = useAuth()
  const [setupStatus, setSetupStatus] = useState<{ loaded: boolean; hasAdmin?: boolean }>({ loaded: false })

  useEffect(() => {
    if (user) return

    const getStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/setup-status`)
        if (!response.ok) {
          setSetupStatus({ loaded: true, hasAdmin: true })
          return
        }

        const data = await response.json()
        setSetupStatus({ loaded: true, hasAdmin: data.hasAdmin })
      } catch {
        setSetupStatus({ loaded: true, hasAdmin: true })
      }
    }

    getStatus()
  }, [user])

  if (user) {
    if (user.role === 'sysadmin') return <Navigate to="/sysadmin" replace />
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  if (!setupStatus.loaded) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Loading...</div>
  }

  return <Navigate to={setupStatus.hasAdmin ? '/landing' : '/setup'} replace />
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/role-selector" element={<RoleSelector />} />
      <Route path="/student-signup" element={<StudentSignup />} />
      <Route path="/admin-signup" element={<AdminSignup />} />
      <Route path="/sysadmin-signup" element={<SysadminSignup />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminApp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sysadmin/*"
        element={
          <ProtectedRoute role="sysadmin">
            <SysadminApp />
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
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/new-task" element={<NewTask />} />
        <Route path="/resource-center" element={<ResourceCenter />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subject/:subjectName" element={<SubjectDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
