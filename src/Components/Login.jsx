import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../services/apiService';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
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
      
      // ⚡ Lưu Session User vào localStorage
      localStorage.setItem('userSession', JSON.stringify(res.user));

      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }

      // Chuyển hướng về trang chủ
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Đăng nhập</h1>

        {errorMessage && (
          <div style={{
            color: '#ef4444',
            backgroundColor: '#fef2f2',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              id="email"
              className="login-input"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className="login-label">Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className="login-label">Mật khẩu</label>
          </div>

          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="login-links">
          <Link to="/register" className="link-item">
            Bạn chưa có tài khoản? Đăng ký!
          </Link>
        </div>
      </div>
    </div>
  );
}