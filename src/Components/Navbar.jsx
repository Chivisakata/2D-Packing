import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ userSession, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng menu khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    if (onLogout) onLogout();
    setShowDropdown(false);
  };

  // Cắt lấy chuỗi trước dấu '@'
  const username = userSession?.email ? userSession.email.split('@')[0] : '';

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#000000', fontSize: '30px', fontWeight: 600 }}>2D-Packing</span>
          <span style={{ fontSize: '20px', fontWeight: 600, color: '#3b82f6' }}>.net</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Trang Chủ</Link></li>
        <li><Link to="/contact">Liên Hệ</Link></li>

        {userSession ? (
          <li className="user-menu" ref={dropdownRef}>
            <button 
              type="button" 
              className="user-btn" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{username}</span>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/history" onClick={() => setShowDropdown(false)}>Xem lịch sử</Link>
                <button type="button" onClick={handleLogout}>Đăng xuất</button>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link to="/login">Đăng Nhập</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}