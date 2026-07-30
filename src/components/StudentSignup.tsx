import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

const specialCharacterPattern = /[^A-Za-z0-9]/
const numberPattern = /\d/
const studentEmailPattern = /^[^@\s]+@ncit\.edu\.np$/i

export default function StudentSignup() {
  const navigate = useNavigate()
  const { user, signup } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [semester, setSemester] = useState('')
  const [section, setSection] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role === 'sysadmin') {
        navigate('/sysadmin', { replace: true })
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [navigate, user])

  const getPasswordError = () => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters.'
    }

    if (!numberPattern.test(password)) {
      return 'Password must contain at least one number.'
    }

    if (!specialCharacterPattern.test(password)) {
      return 'Password must contain at least one special character.'
    }

    return ''
  }

  const getEmailError = () => {
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      return 'Email is required.'
    }

    if (!studentEmailPattern.test(normalizedEmail)) {
      return 'Email must be in format: name@ncit.edu.np'
    }

    return ''
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const emailError = getEmailError()
    if (emailError) {
      setError(emailError)
      return
    }

    if (!password.trim()) {
      setError('Enter a password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const passwordError = getPasswordError()
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (!name.trim()) {
      setError('Full Name is required.')
      return
    }

    if (!semester) {
      setError('Please select your semester.')
      return
    }

    if (!section) {
      setError('Please select your section.')
      return
    }

    setLoading(true)
    try {
      await signup(email.trim(), password, 'student', { name: name.trim(), semester, section })
      alert('Your registration request has been submitted for admin approval. Please wait until approved before logging in.')
      navigate('/signin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <p>Smart Study Planner</p>
          <h1>Student Sign Up</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              required
            />
          </label>

          <label style={{ marginTop: '1rem' }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@ncit.edu.np"
              required
            />
          </label>
          <p className="auth-hint">Must use your NCIT email address</p>

          <label style={{ marginTop: '1rem' }}>
            Semester
            <select
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                marginTop: '0.25rem',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select Semester</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 7">Semester 7</option>
              <option value="Semester 8">Semester 8</option>
            </select>
          </label>

          <label style={{ marginTop: '1rem' }}>
            Section
            <select
              value={section}
              onChange={(event) => setSection(event.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                marginTop: '0.25rem',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
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
          <p className="auth-hint">
            Use at least 6 characters with a number and special character.
          </p>

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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <a href="/signin">Sign in</a>
          </p>
          <p>
            <a href="/">Back to role selection</a>
          </p>
        </div>
      </div>
    </div>
  )
}
