import React, { useState } from 'react';

const AUTO_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export default function PreviewPanel({ items = [], containers = [] }) {
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [showUnpackedDropdown, setShowUnpackedDropdown] = useState(false);

  // Tấm phôi đang chọn
  const currentSheet = containers[selectedSheetIndex] || containers[0] || { width: 1200, height: 800, name: 'Tấm A' };
  const sheetW = Number(currentSheet.width) || 1200;
  const sheetH = Number(currentSheet.height) || 800;

  // Tính toán vị trí xếp hình thử nghiệm (mm)
  let currentX = 20;
  let currentY = 20;
  let maxHeightInRow = 0;
  let usedArea = 0;

  items.forEach(item => {
    const w = Number(item.dimensions?.w || item.dimensions?.b || item.dimensions?.d || 200);
    const h = Number(item.dimensions?.h || item.dimensions?.d || 150);
    const qty = Number(item.quantity) || 1;
    usedArea += (w * h * qty);
  });

  const totalSheetArea = sheetW * sheetH;
  const efficiency = totalSheetArea > 0 ? ((usedArea / totalSheetArea) * 100).toFixed(2) : '0.00';

  return (
    <div className="right-column">
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 className="preview-title">
          Xem Trước Sơ Đồ Bố Trí (Layout Preview)
        </h2>

        {/* Khung Canvas chứa tấm phôi SVG */}
        <div id="previewContainer" className="preview-box">
          <svg
           id="canvasSheet"
            width="100%"
            height="100%"
            viewBox={`0 0 ${sheetW} ${sheetH}`}
            style={{
            width: '90%',
            height: '90%',               /* ⚡ ĐIỂM MẤU CHỐT: Mở rộng 100% chiều dọc */
            flexGrow: 1,                   /* Tự động dãn lấp đầy khoảng trống còn thừa */
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#f1f5f9" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {items.map((item, index) => {
              const color = AUTO_COLORS[index % AUTO_COLORS.length];
              const w = Number(item.dimensions?.w || item.dimensions?.b || item.dimensions?.d || 200);
              const h = Number(item.dimensions?.h || item.dimensions?.d || 150);

              if (currentX + w + 20 > sheetW) {
                currentX = 20;
                currentY += maxHeightInRow + 20;
                maxHeightInRow = 0;
              }

              const posX = currentX;
              const posY = currentY;

              currentX += w + 20;
              if (h > maxHeightInRow) maxHeightInRow = h;

              return (
                <g key={item.id || index}>
                  <rect
                    x={posX}
                    y={posY}
                    width={w}
                    height={h}
                    fill={color}
                    rx="6"
                    ry="6"
                    stroke="#0f172a"
                    strokeOpacity="0.25"
                    strokeWidth="2"
                  />
                  <text
                    x={posX + w / 2}
                    y={posY + h / 2}
                    fill="#ffffff"
                    fontSize="24"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                  >
                    {`${w}x${h}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ⚡ CÁC THÀNH PHẦN THỐNG KÊ (STATS FOOTER) */}
      <div className="stats-footer">
        
        {/* 1. Chọn tấm hiển thị */}
        <div className="stats-group">
          <label className="stats-label">Hiển thị tấm kết quả:</label>
          <div className="stats-select-wrapper">
            <i className="fa-solid fa-layer-group stats-select-icon"></i>
            <select 
              className="stats-select"
              value={selectedSheetIndex}
              onChange={(e) => setSelectedSheetIndex(Number(e.target.value))}
            >
              {containers.map((c, idx) => (
                <option key={c.id || idx} value={idx}>
                  {c.name || `Tấm ${idx + 1}`} ({c.width}x{c.height})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Chi tiết chưa sắp xếp (Popover Dropdown) */}
        <div className="stats-group">
          <label className="stats-label">Chi tiết chưa sắp xếp:</label>
          <button 
            className="stats-unpacked-btn"
            onClick={() => setShowUnpackedDropdown(!showUnpackedDropdown)}
          >
            <span className="unpacked-text">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>0 chi tiết chưa xếp</span>
            </span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', color: '#94a3b8' }}></i>
          </button>

          {showUnpackedDropdown && (
            <div className="unpacked-dropdown">
              <div className="unpacked-dropdown-header">Danh sách chưa vừa tấm:</div>
              <div className="unpacked-item">
                <span>• Tất cả chi tiết đều đã xếp vừa tấm</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Diện tích sử dụng trên tấm */}
        <div className="stats-group">
          <label className="stats-label">Diện tích dùng trên tấm chọn:</label>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="area-value">{usedArea.toLocaleString()} mm²</span>
            <span className="area-efficiency">({efficiency}%)</span>
          </div>
        </div>

      </div>
    </div>
  );
}