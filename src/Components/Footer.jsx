import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Cột 1: Support / Hỗ Trợ */}
        <div className="footer-col">
          <h3>Support</h3>
          <ul>
            <li><a href="#faqs">Instructions/FAQs</a></li>
            <li><a href="#merge-instructions">Merge (Imposition) Instructions</a></li>
            <li><a href="#mail-merge">Mail Merge Instructions</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#videos">Instructional Videos</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>

        {/* Cột 2: Quick Links / Liên Kết Nhanh */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#calculators">Free Calculators & Tools</a></li>
            <li><a href="#demo">Demo Pages</a></li>
            <li><a href="#templates">System Templates</a></li>
            <li><a href="#security">Security & Privacy</a></li>
          </ul>
        </div>

        {/* Cột 3: Thương hiệu 2D-Packing.net */}
        <div className="footer-col brand-col">
          <h3>
            <span style={{ color: '#0f172a' }}>2D-Packing</span>
            <span style={{ color: '#3b82f6' }}>.net</span>
          </h3>
          <p className="footer-desc">
            Phần mềm trực tuyến tối ưu bố trí cắt 2D, xếp hình tự động, giảm hao hụt vật liệu và ước tính chi phí gia công nhanh chóng trên mọi thiết bị.
          </p>
          <p className="footer-copyright">
            © 2026 2D-Packing.net. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}