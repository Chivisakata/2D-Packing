import React from 'react';
import './SeoSection.css';

export default function SeoSection() {
  return (
    <section className="seo-section">
      <h2 className="seo-title">
        Dễ Dàng Trực Quan Hóa & Tối Ưu Sơ Đồ Cắt
      </h2>

      <div className="seo-content">
        <p>
          Công cụ <strong>2D-Packing.net</strong> giúp bạn nhanh chóng hình dung cách sắp xếp các chi tiết (nhãn dán, tem nhãn, tấm gia công) lên khung vật liệu gốc. Chỉ cần nhập kích thước và số lượng, hệ thống sẽ lập tức tính toán bố trí tối ưu kèm thống kê diện tích sử dụng chi tiết.
        </p>

        <p>
          Ứng dụng vận hành dựa trên <strong>thuật toán tối ưu 2D (Rectangle Packing)</strong> phức tạp nhưng được đóng gói thành giao diện tối giản, dễ dùng. Bạn có thể lập kế hoạch cắt phôi, tiết kiệm vật tư và kiểm tra chính xác số lượng chi tiết vừa vặn trước khi tiến hành gia công thực tế.
        </p>
      </div>
    </section>
  );
}