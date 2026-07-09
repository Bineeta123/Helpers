import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTasks } from '../../context/TaskContext'
import '../../App.css'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const searchQuery = new URLSearchParams(location.search).get('search')?.trim() || ''
  const { tasks } = useTasks()

  const pendingTasks = tasks.filter((task) => task.status === 'Pending')
  const matchedTasks = searchQuery
    ? tasks.filter((task) =>
        [task.title, task.note, task.due]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : []

  const focusTask = searchQuery
    ? matchedTasks[0] ?? pendingTasks[0] ?? tasks[0]
    : pendingTasks[0] ?? tasks[0]

  const deadlineTasks = searchQuery ? matchedTasks.slice(0, 3) : tasks.slice(0, 3)
  const assignmentTasks = searchQuery ? matchedTasks.slice(0, 2) : tasks.slice(0, 2)
  const activeDeadlines = deadlineTasks.length ? deadlineTasks : tasks.slice(0, 3)
  const activeAssignments = assignmentTasks.length ? assignmentTasks : tasks.slice(0, 2)

  const handleStartSession = () => {
    window.alert('Session started. Good luck!')
  }

  const handleReschedule = () => {
    navigate('/schedule')
  }

  const handleViewAllDeadlines = () => {
    navigate('/assignments')
  }

  const handleDeadlineClick = (item: string) => {
    window.alert(`Opening deadline details for ${item}.`)
    navigate('/assignments')
  }

  const handleStartMockTest = () => {
    window.alert('Starting mock test session now.')
    navigate('/analytics')
  }

  const totalDeadlines = activeDeadlines.length
  const totalPending = pendingTasks.length
  const focusDue = focusTask.due || 'No due date'
  const focusSubtitle = focusTask.note || `Due ${focusDue}`
  const hasSearchResults = searchQuery ? matchedTasks.length > 0 : true
  const displayName = (() => {
    const rawName = user?.name || user?.email || 'student'
    const localPart = rawName.split('@')[0]
    const firstSegment = localPart.split('.')[0] || localPart
    return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1)
  })()

  const formatDueLabel = (due: string) => {
    if (!due) return 'TBA'
    return due.toUpperCase().slice(0, 8)
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Hi, {displayName}.</p>
          <p>You have {totalDeadlines} deadlines today.</p>
        </div>
      </div>

      {searchQuery ? (
        <div className="search-result-banner">
          {hasSearchResults ? (
            <>Showing search results for <strong>“{searchQuery}”</strong></>
          ) : (
            <>No results found for <strong>“{searchQuery}”</strong>. Showing nearest tasks.</>
          )}
        </div>
      ) : null}

      <section className="dashboard-grid">
        <div className="dashboard-hero">
          <div className="hero-header">
            <span className="hero-badge">TODAY’S FOCUS</span>
            <span className="hero-priority">{focusTask.status === 'Pending' ? 'Priority: High' : 'Priority: Normal'}</span>
          </div>
          <h2>{focusTask.title}</h2>
          <p>{focusSubtitle}</p>
          <div className="hero-stats">
            <div className="hero-stat">Due: {focusDue}</div>
            <div className="hero-stat">Status: {focusTask.status}</div>
            <div className="hero-stat">Pending tasks: {totalPending}</div>
          </div>
          <div className="hero-actions">
            <button className="btn-primary" type="button" onClick={handleStartSession}>
              Start Session
            </button>
            <button className="btn-secondary" type="button" onClick={handleReschedule}>
              Reschedule
            </button>
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="card card-deadlines">
            <div className="card-header">
              <span>Deadlines</span>
              <button type="button" className="link-button" onClick={handleViewAllDeadlines}>
                View All
              </button>
            </div>
            {activeDeadlines.map((task) => (
              <button
                key={task.id}
                type="button"
                className="deadline-item"
                onClick={() => handleDeadlineClick(task.title)}
              >
                <div className="deadline-date">{formatDueLabel(task.due)}</div>
                <div>
                  <div className="deadline-title">{task.title}</div>
                  <div className="deadline-subtitle">{task.note}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="dashboard-card-row">
        <div className="card card-white card-summary">
          <div className="card-title">Assignments</div>
          <div className="card-subtitle">{tasks.length} active items</div>
          {activeAssignments.map((task) => (
            <div className="assignment-item" key={task.id}>
              <span className="assignment-name">{task.title}</span>
              <span className={`assignment-status ${task.status === 'Pending' ? 'pending' : 'completed'}`}>
                {task.note}
              </span>
            </div>
          ))}
        </div>

        <div className="card card-white card-summary">
          <div className="card-title">MCQ Mastery</div>
          <div className="card-subtitle">2 sets pending</div>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-label">Agile Software Development</div>
              <div className="stat-value">86%</div>
              <div className="stat-note">AVG SCORE</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Operating Systems</div>
              <div className="stat-value">91%</div>
              <div className="stat-note">AVG SCORE</div>
            </div>
          </div>
          <button className="btn-outline" type="button" onClick={handleStartMockTest}>
            Start Mock Test
          </button>
        </div>

        <div className="card card-dark card-goal">
          <div className="card-title-light">Weekly Goal</div>
          <div className="goal-value">32/40h</div>
          <div className="goal-progress">
            <div className="goal-bar"></div>
          </div>
          <div className="goal-note">Study 40 hours this week. You’re almost there!</div>
        </div>
      </section>

      <div className="card card-white card-activity">
        <div className="card-title">Recent Activity</div>
        <div className="activity-row header-row">
          <span>DATE</span>
          <span>SUBJECT</span>
          <span>TASK</span>
          <span>STATUS</span>
          <span>ACTION</span>
        </div>
        <div className="activity-row">
          <span>Today, 9:30 AM</span>
          <span>Network programming</span>
          <span>Completed Quiz #3</span>
          <span className="status completed">Completed</span>
          <span>•••</span>
        </div>
        <div className="activity-row">
          <span>Yesterday</span>
          <span>Artificial Intelligence</span>
          <span>Read Chapter 5 Notes</span>
          <span className="status completed">Completed</span>
          <span>•••</span>
        </div>
        <div className="activity-row">
          <span>Yesterday</span>
          <span>Applied Software Dependability</span>
          <span>Practice Session</span>
          <span className="status pending">Pending</span>
          <span>•••</span>
        </div>
      </div>
    </section>
  )
}
