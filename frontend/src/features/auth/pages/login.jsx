import React from 'react'
import '../auth.form.scss'
import { useNavigate } from 'react-router'

const Login = () => {
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle login logic here
    }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>

          <div className="button primary-button">
            <button type="submit">Login</button>
          </div>
        </form>
        <p className="form-text">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="link-button"
          >
            Register
          </button>
        </p>

      </div>
    </main>
  )
}

export default Login