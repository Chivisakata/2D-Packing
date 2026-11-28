import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../services/apiService';
import { usePacking } from '../context/PackingContext';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = usePacking();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await loginApi(email, password);
      login(res.user);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Đăng nhập</h1>

        {errorMessage && (
          <div className="auth-alert auth-alert--error">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <input
              type="email"
              id="email"
              className="auth-input"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className="auth-label">Email</label>
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className="auth-label">Mật khẩu</label>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/register" className="link-item">
            Bạn chưa có tài khoản? Đăng ký!
          </Link>
        </div>
      </div>
    </div>
  );
}