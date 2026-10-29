import React from 'react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
      <span style={{ color: '#000000', fontSize: '30px' , fontWeight: 600 }}>2D-Packing</span><span style={{fontSize: '20px', fontWeight: 600 }}>.net</span>
      </div>
      <ul className="navbar-links">
        <li><a href="#home">Tính Năng</a></li>
        <li><a href="#about">Liên Hệ</a></li>
        <li><a href="#services">Đăng Nhập</a></li>
      </ul>
    </nav>
    
  );
}