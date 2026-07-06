import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../context/AuthContext'

const roles: UserRole[] = ['admin', 'user']
const specialCharacterPattern = /[^A-Za-z0-9]/
const numberPattern = /\d/

type AuthMode = 'signin' | 'signup'

type LoginProps = {
  initialMode?: AuthMode
}

export default function Login({ initialMode = 'signin' }: LoginProps) {
  const navigate = useNavigate()
  const { user, login, signup } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/student', { replace: true })
    }
  }, [navigate, user])

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setError('')
    setPassword('')
    setConfirmPassword('')
  }

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Enter email, password, and role.')
      return
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name to create an account.')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (mode === 'signup') {
      const passwordError = getPasswordError()
      if (passwordError) {
        setError(passwordError)
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await signup(name.trim(), email.trim(), password, role)
      } else {
        await login(email.trim(), password, role)
      }

      navigate(role === 'admin' ? '/admin' : '/student')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <p>Study Planner</p>
          <h1>{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>
        </div>

        <div className="auth-tabs" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'signin' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => switchMode('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => switchMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' ? (
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {mode === 'signup' ? (
            <>
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
            </>
          ) : (
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
          )}

          {mode === 'signup' ? (
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                required
              />
            </label>
          ) : null}

          <fieldset>
            <legend>Select role</legend>
            {roles.map((option) => (
              <label key={option} className="role-option">
                <input
                  type="radio"
                  name="role"
                  value={option}
                  checked={role === option}
                  onChange={() => setRole(option)}
                />
                {option === 'admin' ? 'Admin' : 'Student'}
              </label>
            ))}
          </fieldset>

          {error ? <div className="auth-error">{error}</div> : null}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}
