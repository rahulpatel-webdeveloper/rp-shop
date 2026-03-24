import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate('/account');
  };

  return (
    <Layout>
      <section className="auth-page">
        <div className="auth-card">
          <div className="auth-card__header">
            <p className="auth-kicker">Welcome Back</p>
            <h1 className="auth-title">Sign in to your account</h1>
            <p className="auth-subtitle">
              Access your orders, save items, and manage your profile.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              Email address
              <input
                className="auth-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="auth-label">
              Password
              <input
                className="auth-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </label>

            {error && <div className="auth-alert">{error}</div>}

            <button className="auth-primary-btn" type="submit">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            <span>New here?</span>
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
