import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link từ react-router-dom
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login credentials:', { email, password });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">File Splice Login</h1>

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
            <label htmlFor="email" className="login-label">Email Address</label>
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
            <label htmlFor="password" className="login-label">Password</label>
          </div>

          <button type="submit" className="btn-login-submit">
            Sign me in
          </button>
        </form>

        <div className="oauth-group">
          <button type="button" className="btn-oauth">
            <span className="oauth-icon">G</span> Google
          </button>
          <button type="button" className="btn-oauth">
            <span className="oauth-icon">❖</span> Dropbox
          </button>
          <button type="button" className="btn-oauth">
            <span className="oauth-icon">⊞</span> Microsoft
          </button>
        </div>

        {/* 📌 VỊ TRÍ VIẾT DÒNG LINK ĐÂY NHA HẠO */}
        <div className="login-links">
          <a href="#forgot-password" className="link-item">Forgot Password</a>
          
          {/* Đổi thẻ <a> thành thẻ <Link> để chuyển sang trang Register không reload */}
          <Link to="/register" className="link-item">
            Don't have an account? Sign up!
          </Link>
        </div>

      </div>
    </div>
  );
}