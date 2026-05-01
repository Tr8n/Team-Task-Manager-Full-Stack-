import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './SignupPage.css';

const SignupPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isLogin
        ? await authAPI.login({
            email: formData.email.trim().toLowerCase(),
            password: formData.password
          })
        : await authAPI.register({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            role: formData.role
          });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h2 className="signup-title">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="signup-subtitle">
            {isLogin ? 'Welcome back! Please sign in to continue.' : 'Join Team Task Manager to manage projects and tasks.'}
          </p>
          {isLogin && (
            <p className="signup-credentials">
              Admin login: <strong>admin@linkup.local</strong> / <strong>Admin@123</strong>
            </p>
          )}
        </div>

        <div className="signup-card">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary signup-btn"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
              </button>
            </div>
          </form>

          <div className="signup-divider">
            <div className="divider-line"></div>
            <span className="divider-text">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <div className="divider-line"></div>
          </div>

          <div className="signup-switch">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="btn btn-secondary switch-btn"
            >
              {isLogin ? 'Create new account' : 'Sign in to existing account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
