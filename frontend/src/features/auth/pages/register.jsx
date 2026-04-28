import React from 'react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import '../auth.form.scss'
    
const Register = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { handleRegister, loading } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await handleRegister({ name, email, password })
            navigate('/')
        } catch (err) {
            console.error("Registration error:", err)
            setError(err?.message || "Registration failed")
        }
    }
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand-lockup auth-brand">
          <span className="brand-mark">
            <img src="/interview-master-logo.svg" alt="" />
          </span>
          <div>
            <p className="eyebrow">Interview Master</p>
            <h1>Build a sharper interview strategy.</h1>
          </div>
        </div>

        <div className="auth-preview">
          <p>Prep dashboard</p>
          <strong>3 steps</strong>
          <span>Add your resume, describe yourself, paste the role, and generate a tailored report.</span>
        </div>
      </section>

      <section className="form-container" aria-labelledby="register-title">
        <p className="eyebrow">Create account</p>
        <h2 id="register-title">Start your prep workspace</h2>
        <p className="auth-subtitle">Create an account to generate and review interview reports.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">
              Name
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>

            <label htmlFor="email">
              Email
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Create a password"
                minLength="6"
                required
              />
            </label>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="button primary-button">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        <p className="form-text">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="link-button"
          >
            Login
          </button>
        </p>
      </section>
    </main>
  )
}

export default Register
