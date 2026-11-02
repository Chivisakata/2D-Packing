import React from 'react';

const AUTO_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export default function PreviewPanel({ items = [], containers = [] }) {
  // Lấy tấm phôi đầu tiên hoặc mặc định 1200x800 mm (Dùng cho tọa độ thực tế)
  const currentSheet = containers[0] || { width: 1200, height: 800 };
  const sheetW = Number(currentSheet.width) || 1200;
  const sheetH = Number(currentSheet.height) || 800;

  // Tính toán vị trí xếp hình thử nghiệm (Toàn bộ theo kích thước thực mm)
  let currentX = 20;
  let currentY = 20;
  let maxHeightInRow = 0;

  return (
    <div className="right-column">
      <h2 className="preview-title">
        Xem Trước Sơ Đồ Bố Trí (Layout Preview)
      </h2>

      <div id="previewContainer" className="preview-box">
        {/* SVG PHÓNG TO KHUNG HIỂN THỊ NHƯNG GIỮ NGUYÊN TỌA ĐỘ BÊN TRONG */}
        <svg
          id="canvasSheet"
          width="100%"
          height="100%"
          viewBox={`0 0 ${sheetW} ${sheetH}`}
          style={{
            maxHeight: '650px', /* Giới hạn chiều cao tối đa cho đẹp mắt */
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Lưới tọa độ chìm (chia mỗi ô 100x100mm) */}
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#f1f5f9" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Render các khối rect (Vẽ hoàn toàn theo tọa độ & kích thước thực mm) */}
          {items.map((item, index) => {
            const color = AUTO_COLORS[index % AUTO_COLORS.length];
            
            // Kích thước chuẩn mm
            const w = Number(item.dimensions?.w || item.dimensions?.b || item.dimensions?.d || 200);
            const h = Number(item.dimensions?.h || item.dimensions?.d || 150);

            // Tính toán vị trí xếp thử (mm)
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
                {/* Thẻ rect chuẩn kích thước mm */}
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
                {/* Chữ hiển thị kích thước mm */}
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
  );
}