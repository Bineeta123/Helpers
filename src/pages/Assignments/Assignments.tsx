import { useTasks } from '../../context/TaskContext'
import '../../App.css'
import './Assignments.css'

export default function Assignments() {
  const { tasks, completeTask } = useTasks()

  const completedCount = tasks.filter((task) => task.status === 'Completed').length
  const pendingCount = tasks.length - completedCount

  return (
    <section className="section-grid">
      <div className="card card-white">
        <div className="card-title">Upcoming Assignments</div>
        <div className="assignment-list">
          {tasks.map((task) => (
            <div className="assignment-row" key={task.id}>
              <div>
                <strong>{task.title}</strong>
                <div className="section-copy">{task.note}</div>
              </div>
              <div className="assignment-row-actions">
                <span className={task.status === 'Completed' ? 'status completed' : 'status pending'}>
                  {task.status}
                </span>
                {task.status === 'Pending' ? (
                  <button type="button" className="btn-outline small" onClick={() => completeTask(task.id)}>
                    Mark done
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card card-white">
        <div className="card-title">Progress Tracker</div>
        <div className="progress-item">
          <span>Completed</span>
          <span>{completedCount > 0 ? `${Math.round((completedCount / tasks.length) * 100)}%` : '0%'}</span>
        </div>
        <div className="progress-item">
          <span>Pending</span>
          <span>{pendingCount > 0 ? `${Math.round((pendingCount / tasks.length) * 100)}%` : '0%'}</span>
        </div>
      </div>
    </section>
  )
}
