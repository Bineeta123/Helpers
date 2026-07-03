import { useEffect, useState, type FormEvent } from 'react'
import { FiSearch } from 'react-icons/fi'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar/sidebar'
import ScrollToTop from '../components/ScrollToTop'
import '../App.css'

type TopbarId = 'overview' | 'calendar' | 'reports'

const TOPBAR_LINKS: TopbarId[] = ['overview', 'calendar', 'reports']

const TOPBAR_LABELS: Record<TopbarId, string> = {
  overview: 'Overview',
  calendar: 'Calendar',
  reports: 'Reports',
}

const TOPBAR_ROUTES: Record<TopbarId, string> = {
  overview: '/dashboard',
  calendar: '/schedule',
  reports: '/analytics',
}

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTopbar, setActiveTopbar] = useState<TopbarId>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchQuery(params.get('search') ?? '')
  }, [location.search])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) {
      return
    }

    navigate(`/dashboard?search=${encodeURIComponent(trimmedQuery)}`)
  }

  const handleTopbarClick = (link: TopbarId) => {
    setActiveTopbar(link)
    navigate(TOPBAR_ROUTES[link])
  }

  const handleLogoClick = () => {
    navigate('/dashboard')
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="dashboard">
        <div className="dashboard-inner">
          <ScrollToTop />
          <header className="topbar">
            <div className="topbar-left">
              <div className="topbar-brand-group">
                <button type="button" className="topbar-brand" onClick={handleLogoClick}>
                  <div className="topbar-logo-badge">SSP</div>
                </button>
                <div className="topbar-links">
                  {TOPBAR_LINKS.map((link) => (
                    <button
                      key={link}
                      type="button"
                      className={link === activeTopbar ? 'topbar-link active' : 'topbar-link'}
                      onClick={() => handleTopbarClick(link)}
                    >
                      {TOPBAR_LABELS[link]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="topbar-right">
              <form className="topbar-search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="topbar-search-input"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search tasks..."
                  aria-label="Search tasks"
                />
                <button type="submit" className="topbar-search-button">
                  <FiSearch />
                </button>
              </form>
            </div>
          </header>

          <main className="dashboard-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
