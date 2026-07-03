import '../../App.css'
import './Resources.css'

export default function Resources() {
  const handleOpenResource = (resource: string) => {
    window.alert(`Opening ${resource}`)
  }

  return (
    <section className="section-grid">
      <div className="card card-white">
        <div className="card-title">Resource Center</div>
        <div className="resource-list">
          <div className="resource-row">
            <span>Physics Formula Sheet</span>
            <button type="button" className="btn-outline" onClick={() => handleOpenResource('Physics Formula Sheet')}>Open</button>
          </div>
          <div className="resource-row">
            <span>Chemistry Lab Guide</span>
            <button type="button" className="btn-outline" onClick={() => handleOpenResource('Chemistry Lab Guide')}>Open</button>
          </div>
          <div className="resource-row">
            <span>Operating Systems Notes</span>
            <button type="button" className="btn-outline" onClick={() => handleOpenResource('Operating Systems Notes')}>Open</button>
          </div>
        </div>
      </div>
      <div className="card card-white">
        <div className="card-title">Recommended Reads</div>
        <p className="section-copy">Review the study guides and sample questions to improve retention before exams.</p>
      </div>
    </section>
  )
}
