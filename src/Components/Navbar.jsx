import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#000000', fontSize: '30px', fontWeight: 600 }}>2D-Packing</span>
          <span style={{ fontSize: '20px', fontWeight: 600, color: '#3b82f6' }}>.net</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Tính Năng</Link></li>
        <li><a href="#about">Liên Hệ</a></li>
        <li><Link to="/login">Đăng Nhập</Link></li>
      </ul>
    </nav>
  );
}