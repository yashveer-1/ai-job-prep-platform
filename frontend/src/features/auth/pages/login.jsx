import React from 'react';
import '../auth.form.scss';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await handleLogin({ email, password });
      navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand-lockup auth-brand">
          <span className="brand-mark">
            <img src="/interview-master-logo.svg" alt="" />
          </span>
          <div>
            <p className="eyebrow">Interview Master</p>
            <h1>Practice with a plan, not guesswork.</h1>
          </div>
        </div>

        <div className="auth-preview">
          <p>Match score</p>
          <strong>82%</strong>
          <span>Likely questions, skill gaps, and prep tips in one focused report.</span>
        </div>
      </section>

      <section className="form-container" aria-labelledby="login-title">
        <p className="eyebrow">Welcome back</p>
        <h2 id="login-title">Log in to your workspace</h2>
        <p className="auth-subtitle">Continue preparing for your next interview.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">
              Email
              <input
                type="email"
                id="email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </label>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="button primary-button">
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
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
      </section>
    </main>
  );
};

export default Login;
