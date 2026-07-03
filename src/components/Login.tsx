import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../context/AuthContext'

const roles: UserRole[] = ['admin', 'user']

export default function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true })
    }
  }, [navigate, user])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Enter email, password, and role.')
      return
    }

    setLoading(true)
    try {
      await login(email, password, role)
      navigate(`/${role}`)
    } catch (err) {
      setError('Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <h1>Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
