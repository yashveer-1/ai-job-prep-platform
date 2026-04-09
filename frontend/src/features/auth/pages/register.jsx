import React from 'react'
import { useNavigate } from 'react-router'
    
const Register = () => {
    const navigate = useNavigate()
    const handleSubmit = (e) => {   
        e.preventDefault()
        // Handle registration logic here
    }
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
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