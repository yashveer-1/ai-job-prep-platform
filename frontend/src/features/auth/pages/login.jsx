import React from 'react';
import '../auth.form.scss';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
  const navigate = useNavigate();

  // ✅ Correct extraction
  const { handleLogin, loading } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // ✅ Clean submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending:", { email, password }); // DEBUG

    try {
      // ✅ IMPORTANT: await
      await handleLogin({ email, password });

      console.log("Login success");

      // ✅ Redirect after login
      navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.message || "Login failed");
    }
  };

  // ✅ Correct loading usage
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}                 // ✅ controlled input
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}            // ✅ controlled input
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
  );
};

export default Login;