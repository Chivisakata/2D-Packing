import React from 'react';
import { usePacking } from '../context/PackingContext';
import './PackingTables.css';

const STRATEGIES = [
  {
    id: 'REMAINDER_OPTIMAL',
    title: 'Tối ưu diện tích phần dư',
    desc: 'Gom cụm phần dư gọn gàng để có thể tái sử dụng cho lần sau.'
  },
  {
    id: 'BALANCED_DISTRIBUTION',
    title: 'Phân bố đều các chi tiết',
    desc: 'Phân bố khoảng cách đều đặn giữa các chi tiết trên tấm.'
  }
];

export default function OptimizationOptions() {
  const {
    strategy,
    setStrategy,
    sawKerf,
    setSawKerf,
    handleReset,
    handleOptimize,
    hasResults,
    userSession,
    handleSaveHistory,
    showToast
  } = usePacking();

  const handleKerfChange = (value) => {
    if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) return;
    setSawKerf(value);
  };

  const handleKerfBlur = (value) => {
    const parsed = parseFloat(value);
    setSawKerf(!isNaN(parsed) && parsed >= 0 ? Math.round(parsed * 100) / 100 : 0);
  };

  const handleSaveClick = () => {
    if (!userSession) {
      showToast('Bạn cần phải đăng nhập để lưu kết quả!', 'warning');
      return;
    }
    handleSaveHistory();
  };

  return (
    <>
      <div className="options-card">
        <h2 className="options-title">
          <i className="fa-solid fa-sliders"></i> Phương án tối ưu
        </h2>

        <div className="options-list">
          {STRATEGIES.map((opt) => {
            const isSelected = strategy === opt.id;
            return (
              <label key={opt.id} className={`option-item ${isSelected ? 'active' : ''}`}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
          <label htmlFor="sawKerfInput" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
            Độ dày lưỡi cắt (cm):
          </label>
          <input
            id="sawKerfInput"
            type="text"
            inputMode="decimal"
            value={sawKerf ?? ''}
            onChange={(e) => handleKerfChange(e.target.value)}
            onBlur={(e) => handleKerfBlur(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="input-style"
            style={{ width: '72px' }}
          />
        </div>
      </div>

      <div className="action-buttons-group">
        <button className="btn-action-reset" onClick={handleReset}>
          Đặt lại cài đặt
        </button>
        <button className="btn-action-optimize" onClick={handleOptimize}>
          BẮT ĐẦU TỐI ƯU
        </button>

        {hasResults && (
          <button className="btn-action-save" onClick={handleSaveClick}>
            LƯU KẾT QUẢ
          </button>
        )}
      </div>
    </>
  );
}