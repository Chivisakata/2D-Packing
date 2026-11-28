import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Cột 1: Điều hướng các trang chức năng */}
        <div className="footer-col">
          <h3>Điều Hướng</h3>
          <ul>
            <li><Link to="/">Công cụ tối ưu cắt 2D</Link></li>
            <li><Link to="/history">Lịch sử sơ đồ cắt</Link></li>
            <li><Link to="/contact">Liên hệ & Góp ý</Link></li>
            <li><Link to="/login">Đăng nhập / Đăng ký</Link></li>
          </ul>
        </div>

        {/* Cột 2: Thông tin kỹ thuật đồ án */}
        <div className="footer-col">
          <h3>Thông Tin Đồ Án</h3>
          <ul>
            <li>Đề tài: Tối ưu bố trí cắt phôi 2D</li>
            <li>Công nghệ: ReactJS & ASP.NET Core API</li>
            <li>Tính năng: Xếp hình tự động & Xuất PDF</li>
            <li>
              Liên hệ: <a href="mailto:2Dpacking@gmail.com">2Dpacking@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Thương hiệu 2D-Packing.net */}
        <div className="footer-col brand-col">
          <h3>
            <span style={{ color: '#0f172a' }}>2D-Packing</span>
            <span style={{ color: '#3b82f6' }}>.net</span>
          </h3>
          <p className="footer-desc">
            Ứng dụng hỗ trợ tính toán, trực quan hóa sơ đồ cắt vật liệu 2D, giảm thiểu phần dư và xuất bản vẽ kỹ thuật nhanh chóng.
          </p>
          <p className="footer-copyright">
            © 2026 2D-Packing.net — Đồ án Sinh viên.
          </p>
        </div>
      </div>
    </footer>
  );
}