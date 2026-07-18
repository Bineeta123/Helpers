import '../../App.css'
import './Schedule.css'

export default function Schedule() {
  return (
    <section className="section-grid">
      <div className="card card-white">
        <div className="card-title">Weekly Schedule</div>
        <div className="schedule-grid">
            <div className="schedule-card">
            <div className="schedule-day">Monday</div>
            <div className="schedule-task">Network programming Problem Set</div>
          </div>
          <div className="schedule-card">
            <div className="schedule-day">Tuesday</div>
            <div className="schedule-task">Agile Software Development Lab Prep</div>
          </div>
          <div className="schedule-card">
            <div className="schedule-day">Wednesday</div>
            <div className="schedule-task">Operating Systems Review</div>
          </div>
          <div className="schedule-card">
            <div className="schedule-day">Thursday</div>
            <div className="schedule-task">Cloud Application Development Revision</div>
          </div>
          <div className="schedule-card">
            <div className="schedule-day">Friday</div>
            <div className="schedule-task">Network programming Concept Drill</div>
          </div>
        </div>
      </div>
      <div className="card card-white">Finish Agile Development lab notes and review operating systems concepts before the next class.</p>
      </div>
    </section>
  )
}
