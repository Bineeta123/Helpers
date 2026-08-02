import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

const specialCharacterPattern = /[^A-Za-z0-9]/
const numberPattern = /\d/

export default function AdminSignup() {
  const navigate = useNavigate()
  const { user, signup } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
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
    if (!email.trim()) {
      return 'Email is required.'
    }

    const lowerEmail = email.toLowerCase().trim();
    if (!lowerEmail.endsWith('@ncit.edu.np')) {
      return 'Teacher email must end with @ncit.edu.np.'
    }

    const localPart = lowerEmail.split('@')[0];
    if (!localPart || !localPart.includes('.') || localPart.startsWith('.') || localPart.endsWith('.')) {
      return 'Teacher email must be in format name.surname@ncit.edu.np.'
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

    setLoading(true)
    try {
      await signup(email.trim(), password, 'admin', { name: name.trim() })
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
          <h1>Teacher Sign Up</h1>
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
              placeholder="name.surname@ncit.edu.np"
              required
            />
          </label>
          <p className="auth-hint">Teacher email must include name.surname and end with @ncit.edu.np</p>

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
