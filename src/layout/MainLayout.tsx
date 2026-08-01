import { type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/sidebar'
import ScrollToTop from '../components/ScrollToTop'
import '../App.css'

type MainLayoutProps = {
  children?: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="dashboard">
        <div className="dashboard-inner">
          <ScrollToTop />

          <main className="dashboard-content">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </div>
  )
}
