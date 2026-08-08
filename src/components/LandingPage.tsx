import { useNavigate } from 'react-router-dom'
import '../styles/LandingPage.css'
import landingImg from './landingpage.png'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-card">
          <div className="landing-card-grid">
            <div className="landing-copy">
              <div className="landing-brand">
                <span className="landing-brand-mark">SSP</span>
                <p className="overline">Smart Study Planner</p>
              </div>

              <h1>Organize classes, approvals, and college life in one beautiful place.</h1>
              <p className="description">
                Set up your first administrator account, configure school details, and empower teachers and students with a calm, modern dashboard experience.
              </p>

              <div className="landing-actions">
                <button className="landing-action-button" onClick={() => navigate('/role-selector')}>
                  Start Registration
                </button>
              </div>
            </div>

            <div className="landing-preview">
              <div className="preview-frame">
                <img
                  className="preview-image"
                  src={landingImg}
                  alt="Teacher and student working together"
                />
              </div>
            </div>
          </div>
        </div>

        <section className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 5.75A2.75 2.75 0 0 1 6.75 3h8.5A2.75 2.75 0 0 1 18 5.75v12.5A2.75 2.75 0 0 1 15.25 21H6.75A2.75 2.75 0 0 1 4 18.25V5.75Z" opacity="0.35" />
                <path d="M8.5 6.5H15.5M8.5 10.5H15.5M8.5 14.5H13.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Fast first-time onboarding</h3>
            <p>Set up your admin account and school profile before any teacher or student registration begins.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6.5h16v11H4z" opacity="0.35" />
                <path d="M7.5 10.5h9M7.5 13.5h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <path d="M8.5 6.5V5.25C8.5 4.56 9.06 4 9.75 4h4.5c.69 0 1.25.56 1.25 1.25V6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Minimalist dashboard design</h3>
            <p>Simple, clean pages keep the focus on classes, approvals, and student progress.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3.5C8.41 3.5 5.5 6.41 5.5 10c0 4.69 5.23 9.96 5.7 10.44a.75.75 0 0 0 1.1 0C13.27 19.96 18.5 14.69 18.5 10c0-3.59-2.91-6.5-6.5-6.5Z" opacity="0.35" />
                <path d="M12 5.5a4.5 4.5 0 0 0-4.5 4.5c0 2.5 2.3 5.52 4.14 7.32a.75.75 0 0 0 1.12 0C14.2 15.52 16.5 12 16.5 10A4.5 4.5 0 0 0 12 5.5Z" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </div>
            <h3>Impactful visual style</h3>
            <p>Soft gradients, calm typography, and fresh spacing create a premium first impression.</p>
          </article>
        </section>
      </div>
    </div>
  )
}
