import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với Điều khoản dịch vụ để tiếp tục!');
      return;
    }
    console.log('Register data:', formData);
    // TODO: Tích hợp gọi API đăng ký của Hạo tại đây
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h1 className="register-title">File Splice Registration</h1>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Email Address */}
          <div className="input-group">
            <input
              type="email"
              id="email"
              className="register-input"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email" className="register-label">Email</label>
          </div>

          {/* First Name & Last Name (Cùng 1 hàng) */}
          <div className="input-row">
            <div className="input-group">
              <input
                type="text"
                id="firstName"
                className="register-input"
                placeholder=" "
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <label htmlFor="firstName" className="register-label">First name</label>
            </div>

            <div className="input-group">
              <input
                type="text"
                id="lastName"
                className="register-input"
                placeholder=" "
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <label htmlFor="lastName" className="register-label">Last name</label>
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <input
              type="password"
              id="password"
              className="register-input"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password" className="register-label">Password</label>
          </div>

          {/* Terms Checkbox */}
          <div className="terms-group">
            <input
              type="checkbox"
              id="agreeTerms"
              className="terms-checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeTerms" className="terms-label">
              By clicking Sign Up, you <a href="#terms" className="terms-link">agree to our Terms</a> and that you have read our Data Policy, including our Cookie Use.
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-register-submit">
            Register
          </button>
        </form>

        {/* Link chuyển sang trang Đăng nhập */}
        <div className="register-links">
          <Link to="/login" className="link-item">
            Already Have An Account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}