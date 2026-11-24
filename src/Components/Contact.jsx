import React from 'react';
import './Contact.css';

export default function Contact() {
  return (
    <div className="contact-wrapper">
      <div className="contact-container">

        {/* Tiêu đề chính & Phụ đề */}
        <div className="contact-header">
          <h1 className="contact-title">Liên Hệ</h1>
          <p className="contact-subtitle">
            Cần trợ giúp thiết lập mẫu hoặc quy trình?<br />
            Hoặc có thể bạn vừa phát hiện ra lỗi? Hãy gửi cho chúng tôi một email và chúng tôi sẽ phản hồi nhanh nhất có thể!
          </p>
        </div>

        {/* Thẻ Email Support chính */}
        <div className="contact-card">
          <h2 className="card-heading">Email Hỗ Trợ</h2>
          <p className="card-subtext">Gửi email trực tiếp đến:</p>

          <a href="mailto:info@filesplice.com" className="email-link">
            2Dpacking@gmail.com
          </a>

          <p className="response-time">
            Chúng tôi thường phản hồi trong vòng vài giờ trong thời gian hoạt động bình thường.
          </p>
        </div>

      </div>
    </div>
  );
}