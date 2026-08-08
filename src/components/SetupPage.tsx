import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5065'
).replace(/\/$/, '')

export default function SetupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/setup-status`)
        if (!response.ok) {
          return
        }

        const data = await response.json()
        if (data.hasAdmin) {
          navigate('/signin', { replace: true })
        }
      } catch {
      }
    }

    checkStatus()
  }, [navigate])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !schoolName.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          confirmPassword,
          schoolName: schoolName.trim(),
          schoolAddress: schoolAddress.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = data.message || 'Setup failed. Please try again.'
        throw new Error(message)
      }

      alert('First administrator account created successfully. You can now sign in.')
      navigate('/signin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <p>Smart Study Planner</p>
          <h1>First-Time Setup</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Administrator Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="hod.department@ncit.edu.np"
              required
            />
          </label>
          <p className="auth-hint">Use the administrator email address pattern: hod.department@ncit.edu.np (e.g. hod.software@ncit.edu.np)</p>

          <label>
            School Name
            <input
              type="text"
              value={schoolName}
              onChange={(event) => setSchoolName(event.target.value)}
              placeholder="Enter your school or college name"
              required
            />
          </label>

          <label>
            School Address
            <input
              type="text"
              value={schoolAddress}
              onChange={(event) => setSchoolAddress(event.target.value)}
              placeholder="Enter your school's address"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </label>
          <p className="auth-hint">Use at least 6 characters with a number and special character.</p>

          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              required
            />
          </label>

          {error ? <div className="auth-error">{error}</div> : null}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating administrator...' : 'Create Administrator'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <a href="/signin">Sign in</a>
          </p>
          <p>
            <a href="/">Back to home</a>
          </p>
        </div>
      </div>
    </div>
  )
}
