import React from 'react';
import './PackingTables.css';

export default function OptimizationOptions({ strategy, setStrategy, onReset, onOptimize }) {
  const options = [
    {
      id: 'REMAINDER_OPTIMAL',
      title: 'Tối ưu diện tích phần dư',
      desc: 'Gom cụm phần dư gọn gàng để có thể tái sử dụng cho lần sau.'
    },
    {
      id: 'BALANCED_DISTRIBUTION',
      title: 'Phân bố đều các chi tiết',
      desc: 'Phân bố khoảng cách đều đặn giữa các chi tiết trên tấm.'
    },
    {
      id: 'MINIMIZE_CONTAINERS',
      title: 'Tối ưu số lượng tấm sử dụng',
      desc: 'Sử dụng ít tấm vật liệu nhất có thể để cắt hết chi tiết.'
    }
  ];

  return (
    <>
      {/* KHUNG PHƯƠNG ÁN TỐI ƯU CẮT */}
      <div className="options-card">
        <h2 className="options-title">
          <i className="fa-solid fa-sliders"></i> Phương án tối ưu cắt
        </h2>

        <div className="options-list">
          {options.map((opt) => {
            const isSelected = strategy === opt.id;
            return (
              <label 
                key={opt.id} 
                className={`option-item ${isSelected ? 'active' : ''}`}
              >
                <input 
                  type="radio" 
                  name="optStrategy" 
                  value={opt.id}
                  checked={isSelected}
                  onChange={(e) => setStrategy(e.target.value)}
                />
                <div>
                  <span className="option-label-title">{opt.title}</span>
                  <span className="option-label-desc">{opt.desc}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* BỘ NÚT HÀNH ĐỘNG: RESET & BẮT ĐẦU TỐI ƯU */}
      <div className="action-buttons-group">
        <button className="btn-action-reset" onClick={onReset}>
          Đặt lại cài đặt (Reset)
        </button>
        <button className="btn-action-optimize" onClick={onOptimize}>
          BẮT ĐẦU TỐI ƯU
        </button>
      </div>
    </>
  );
}