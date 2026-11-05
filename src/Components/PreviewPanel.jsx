import React, { useState } from 'react';

const AUTO_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#14b8a6', '#6366f1', '#a855f7'
];

export default function PreviewPanel({ items = [], containers = [], placedBoxes = [], loading = false }) {
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [showUnpackedDropdown, setShowUnpackedDropdown] = useState(false);

  const currentSheet = containers[selectedSheetIndex] || containers[0] || { width: 1200, height: 800, name: 'Tấm A' };
  const sheetW = Number(currentSheet.width) || 1200;
  const sheetH = Number(currentSheet.height) || 800;

  // ⚡ ID của tấm phôi hiện tại đang chọn (khớp với ID = index + 1 gửi sang C#)
  const currentSheetId = selectedSheetIndex + 1;

  // ⚡ CỐT LÕI: LỌC CHỈ LẤY CÁC HỘP THUỘC VỀ TẤM PHÔI ĐANG CHỌN
  const currentSheetBoxes = Array.isArray(placedBoxes)
    ? placedBoxes.filter(box => {
        const boxSheetId = Number(box.stockSheetId ?? box.sTockSheetID ?? box.STockSheetID ?? 1);
        return boxSheetId === currentSheetId;
      })
    : [];
  // 1. Tính tổng diện tích đã xếp DÀNH RIÊNG CHO TẤM NÀY
  let usedArea = 0;
  currentSheetBoxes.forEach(box => {
    const w = Number(box.Width ?? box.width ?? 0);
    const h = Number(box.Height ?? box.height ?? 0);
    usedArea += (w * h);
  });

  const totalSheetArea = sheetW * sheetH;
  const efficiency = totalSheetArea > 0 ? ((usedArea / totalSheetArea) * 100).toFixed(2) : '0.00';

  // 2. Tạo bảng ánh xạ màu dựa trên kích thước chi tiết
  const sizeColorMap = new Map();
  let colorCounter = 0;

  if (Array.isArray(placedBoxes)) {
    placedBoxes.forEach(box => {
      const w = Number(box.Width ?? box.width ?? 0);
      const h = Number(box.Height ?? box.height ?? 0);
      if (w === 0 || h === 0) return;

      const sizeKey = `${Math.min(w, h)}x${Math.max(w, h)}`;

      if (!sizeColorMap.has(sizeKey)) {
        sizeColorMap.set(sizeKey, AUTO_COLORS[colorCounter % AUTO_COLORS.length]);
        colorCounter++;
      }
    });
  }

  return (
    <div className="right-column">
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 className="preview-title">
          Xem Trước Sơ Đồ Bố Trí (Layout Preview) {loading && <span style={{ color: '#3b82f6', fontSize: '1rem' }}>(Đang tính toán...)</span>}
        </h2>

        <div id="previewContainer" className="preview-box">
          <svg
            id="canvasSheet"
            width="100%"
            height="100%"
            viewBox={`0 0 ${sheetW} ${sheetH}`}
            style={{
              width: '100%',
              height: '100%',
              flexGrow: 1,
              backgroundColor: '#ffffff',
              border: 'none',
              borderRadius: '0px',
              boxShadow: 'none'
            }}
          >
            {/* Lưới caro mờ */}
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cbd5e1" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Khung viền tấm phôi */}
            <rect
              x="0"
              y="0"
              width={sheetW}
              height={sheetH}
              fill="none"
              stroke="#0f172a"
              strokeWidth="4"
            />

            {/* ⚡ VẼ CÁC CÁC CHI TIẾT ĐÃ ĐƯỢC LỌC DÀNH RIÊNG CHO TẤM PHÔI NÀY */}
            {currentSheetBoxes.length > 0 ? (
              currentSheetBoxes.map((box, index) => {
                const x = Number(box.X ?? box.x ?? 0);
                const y = Number(box.Y ?? box.y ?? 0);
                const w = Number(box.Width ?? box.width ?? 0);
                const h = Number(box.Height ?? box.height ?? 0);

                if (w === 0 || h === 0) return null;

                const sizeKey = `${Math.min(w, h)}x${Math.max(w, h)}`;
                const color = sizeColorMap.get(sizeKey) || AUTO_COLORS[0];

                return (
                  <rect
                    key={index}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={color}
                    fillOpacity="0.85"
                    rx="3"
                    ry="3"
                    stroke="#0f172a"
                    strokeOpacity="0.95"
                    strokeWidth="2.5"
                  />
                );
              })
            ) : (
              /* THÔNG BÁO KHI TẤM PHÔI CHỌN CHƯA CÓ HOẶC KHÔNG DÙNG ĐẾN CHI TIẾT NÀO */
              <text x={sheetW / 2} y={sheetH / 2} textAnchor="middle" fill="#94a3b8" fontSize="22" fontWeight="600">
                {loading 
                  ? "Đang xử lý thuật toán..." 
                  : placedBoxes.length > 0 
                    ? "Tấm phôi này chưa được sử dụng (Trống)" 
                    : "Nhấn \"BẮT ĐẦU TỐI ƯU\" để hiển thị sơ đồ cắt"}
              </text>
            )}
          </svg>
        </div>
      </div>

      {/* STATS FOOTER */}
      <div className="stats-footer">
        <div className="stats-group">
          <label className="stats-label">Hiển thị tấm kết quả:</label>
          <div className="stats-select-wrapper">
            <i className="fa-solid fa-layer-group stats-select-icon"></i>
            <select className="stats-select" value={selectedSheetIndex} onChange={(e) => setSelectedSheetIndex(Number(e.target.value))}>
              {containers.map((c, idx) => (
                <option key={c.id || idx} value={idx}>
                  {c.name || `Tấm ${idx + 1}`} ({c.width}x{c.height})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="stats-group">
          <label className="stats-label">Chi tiết trên tấm này:</label>
          <button className="stats-unpacked-btn" onClick={() => setShowUnpackedDropdown(!showUnpackedDropdown)}>
            <span className="unpacked-text">
              <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
              <span>{currentSheetBoxes.length} chi tiết đã xếp</span>
            </span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', color: '#94a3b8' }}></i>
          </button>
        </div>

        <div className="stats-group">
          <label className="stats-label">Diện tích sử dụng:</label>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="area-value">{usedArea.toLocaleString()} mm²</span>
            <span className="area-efficiency">({efficiency}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}