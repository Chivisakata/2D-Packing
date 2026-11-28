import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../services/apiService';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với Điều khoản dịch vụ!');
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi(email, password);
      setSuccessMessage(res.message || 'Đăng ký thành công!');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card auth-card--wide">
        <h1 className="auth-title">Đăng ký tài khoản</h1>

        {errorMessage && (
          <div className="auth-alert auth-alert--error">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="auth-alert auth-alert--success">{successMessage}</div>
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
              minLength={6}
              required
            />
            <label htmlFor="password" className="auth-label">Mật khẩu (tối thiểu 6 ký tự)</label>
          </div>

          <div className="terms-group">
            <input
              type="checkbox"
              id="agreeTerms"
              className="terms-checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label htmlFor="agreeTerms" className="terms-label">
              Tôi đồng ý với các Điều khoản & Điều kiện dịch vụ
            </label>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="link-item">
            Bạn đã có tài khoản? Đăng nhập!
          </Link>
        </div>
      </div>
    </div>
  );
}