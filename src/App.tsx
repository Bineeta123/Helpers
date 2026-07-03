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
// Page components moved to separate files under src/pages/*

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="new-task" element={<NewTask />} />
        <Route path="resource-center" element={<ResourceCenter />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
