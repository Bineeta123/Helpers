import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../../context/TaskContext'
import '../../App.css'
import './NewTask.css'

export default function NewTask() {
  const navigate = useNavigate()
  const { addTask } = useTasks()
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) {
      window.alert('Please enter a task title.')
      return
    }

    addTask({
      title: title.trim(),
      status: 'Pending',
      due: due.trim() || 'No due date',
      note: note.trim() || 'No additional notes',
    })

    navigate('/assignments')
  }

  return (
    <section className="section-grid">
      <div className="card card-white form-card">
        <div className="card-title">Add New Task</div>
        <form className="new-task-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="task-title">Task title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Review chemistry notes"
            />
          </div>

          <div className="form-field">
            <label htmlFor="task-due">Due date</label>
            <input
              id="task-due"
              type="text"
              value={due}
              onChange={(event) => setDue(event.target.value)}
              placeholder="e.g. Oct 30"
            />
          </div>

          <div className="form-field">
            <label htmlFor="task-note">Notes</label>
            <textarea
              id="task-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add task details or study reminders"
              rows={5}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save Task
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/assignments')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
