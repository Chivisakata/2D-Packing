import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Cột 1: Hỗ Trợ & Hướng Dẫn */}
        <div className="footer-col">
          <h3>Hỗ Trợ & Hướng Dẫn</h3>
          <ul>
            <li><a href="#faqs">Hướng dẫn / FAQs</a></li>
            <li><a href="#contact">Liên hệ chúng tôi</a></li>
          </ul>
        </div>

        {/* Cột 2: Liên Kết Nhanh */}
        <div className="footer-col">
          <h3>Liên Kết Nhanh</h3>
          <ul>
            <li><a href="#pricing">Bảng Giá</a></li>
          </ul>
        </div>

        {/* Cột 3: File Splice & Bản quyền */}
        <div className="footer-col">
          <h3>File Splice</h3>
          <p className="footer-copyright">
            © 2026 File Splice. Bảo lưu mọi quyền.
          </p>
        </div>

        {/* Cột 4: Thanh Toán An Toàn */}
        <div className="footer-col">
          <h3>Thanh Toán An Toàn</h3>
        </div>

      </div>
    </footer>
  );
}