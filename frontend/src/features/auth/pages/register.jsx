import React from 'react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
    
const Register = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { handleRegister, loading } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await handleRegister({ name, email, password })
            navigate('/login')
        } catch (err) {
            console.error("Registration error:", err)
            alert(err?.message || "Registration failed")
        }
    }
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button primary-button">
            <button type="submit">Register</button>
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
      </div>
    </main>
  )
}

export default Register