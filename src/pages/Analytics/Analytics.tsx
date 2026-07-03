import '../../App.css'
import './Analytics.css'

export default function Analytics() {
  return (
    <section className="section-grid">
      <div className="card card-white">
        <div className="card-title">Study Analytics</div>
        <div className="chart-summary">
          <div>
            <span className="stat-label">Weekly Study</span>
            <div className="stat-value">32h</div>
          </div>
          <div>
            <span className="stat-label">Goal Completion</span>
            <div className="stat-value">80%</div>
          </div>
        </div>
      </div>
      <div className="card card-white">
        <div className="card-title">Performance</div>
        <div className="stat-box">
          <div className="stat-label">Average Quiz Score</div>
          <div className="stat-value">89%</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Assignment Completion</div>
          <div className="stat-value">92%</div>
        </div>
      </div>
    </section>
  )
}
