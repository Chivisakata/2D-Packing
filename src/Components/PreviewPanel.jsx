import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AUTO_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#14b8a6', '#6366f1', '#a855f7'
];

// ⚡ Hàm bỏ dấu tiếng Việt cho font Helvetica của jsPDF
const removeAccents = (str = '') => {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export default function PreviewPanel({
   items = [], 
  containers = [], 
  placedBoxes = [], 
  loading = false,
  userSession = null,
  onShowToast
  }) {
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [showUnpackedDropdown, setShowUnpackedDropdown] = useState(false);
  
  const exportRef = useRef(null);

  const hasResults = Array.isArray(placedBoxes) && placedBoxes.length > 0 && containers.length > 0;

  const currentSheet = hasResults ? (containers[selectedSheetIndex] || containers[0]) : null;
  const sheetW = currentSheet ? (Number(currentSheet.width) || 800) : 800;
  const sheetH = currentSheet ? (Number(currentSheet.height) || 800) : 800;

  const currentSheetId = selectedSheetIndex + 1;

  const currentSheetBoxes = hasResults
    ? placedBoxes.filter(box => {
        const boxSheetId = Number(box.stockSheetId ?? box.sTockSheetID ?? box.STockSheetID ?? 1);
        return boxSheetId === currentSheetId;
      })
    : [];

  let usedArea = 0;
  currentSheetBoxes.forEach(box => {
    const w = Number(box.Width ?? box.width ?? 0);
    const h = Number(box.Height ?? box.height ?? 0);
    usedArea += (w * h);
  });

  const totalSheetArea = sheetW * sheetH;
  const efficiency = (hasResults && totalSheetArea > 0) ? ((usedArea / totalSheetArea) * 100).toFixed(2) : '0.00';

  const sizeColorMap = new Map();
  let colorCounter = 0;

  if (hasResults) {
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

  // ⚡ HÀM XUẤT PDF TRẮNG ĐEN ĐỒNG NHẤT CM
  const handleExportPDF = async () => {
    if (!userSession) {
      if (onShowToast) {
        onShowToast('Bạn cần phải đăng nhập để xuất file PDF!', 'warning');
      }
      return;
    }
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const svg = clonedDoc.querySelector('#canvasSheet');
          if (svg) {
            svg.style.backgroundColor = '#ffffff';

            const gridPath = svg.querySelector('pattern#grid path');
            if (gridPath) {
              gridPath.setAttribute('stroke', 'none');
            }

            const shapes = svg.querySelectorAll('polygon, ellipse, circle, rect');
            shapes.forEach((shape) => {
              shape.setAttribute('fill', '#ffffff');
              shape.setAttribute('fill-opacity', '1');
              shape.setAttribute('stroke', '#000000');
              shape.setAttribute('stroke-width', '1.5');
              shape.setAttribute('vector-effect', 'non-scaling-stroke');
            });
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.7);
      
      const pdf = new jsPDF({
        orientation: sheetW >= sheetH ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min((pdfWidth - 30) / imgWidth, (pdfHeight - 40) / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = 25;

      // ⚡ Nhập vào bao nhiêu cm thì hiển thị đúng bấy nhiêu cm
      const widthCm = sheetW.toLocaleString('vi-VN');
      const heightCm = sheetH.toLocaleString('vi-VN');
      const rawSheetName = containers[selectedSheetIndex]?.name || `Tam ${selectedSheetIndex + 1}`;
      
      const safeSheetName = removeAccents(rawSheetName).toUpperCase();

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(15);
      pdf.text(`SO DO CAT PHOI 2D: ${safeSheetName}`, pdfWidth / 2, 12, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Kich thuoc phoi: Ngang ${widthCm} cm  x  Cao ${heightCm} cm`, 
        pdfWidth / 2, 
        18, 
        { align: 'center' }
      );

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`So_Do_Cat_${safeSheetName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Lỗi chi tiết xuất PDF:', error);
      alert(`Không thể xuất PDF: ${error.message || 'Vui lòng thử lại!'}`);
    }
  };

  const renderShapeSVG = (box, index, color) => {
    const x = Number(box.X ?? box.x ?? 0);
    const y = Number(box.Y ?? box.y ?? 0);
    const w = Number(box.Width ?? box.width ?? 0);
    const h = Number(box.Height ?? box.height ?? 0);
    const part = box.cuttingPart || box.CuttingPart || {};

    const rawShape = part.shape ?? part.Shape ?? part.$type ?? '';
    const shapeStr = String(rawShape).toLowerCase();

    const commonProps = {
      fill: color,
      fillOpacity: '0.85',
      stroke: '#0f172a',
      strokeOpacity: '0.95',
      strokeWidth: '1.5',
      vectorEffect: 'non-scaling-stroke'
    };

    // 1. LỤC GIÁC ĐỀU
    const isHexagon = 
      part.sideLength !== undefined || 
      part.SideLength !== undefined || 
      shapeStr.includes('hexagon') || 
      rawShape === 3 || 
      rawShape === 5;

    if (isHexagon) {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const isRotated = Boolean(box.isRotated ?? box.IsRotated ?? false);

      const rx = isRotated ? w / Math.sqrt(3) : w / 2;
      const ry = isRotated ? h / 2 : h / Math.sqrt(3);
      const angleOffset = isRotated ? Math.PI / 2 : 0;

      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + angleOffset;
        const px = cx + rx * Math.cos(angle);
        const py = cy + ry * Math.sin(angle);
        points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
      }
      return <polygon key={index} points={points.join(' ')} {...commonProps} />;
    }

    // 2. ELLIPSE
    const isEllipse = 
      part.radiusX !== undefined || 
      part.RadiusX !== undefined || 
      part.majorAxis !== undefined || 
      part.MajorAxis !== undefined || 
      shapeStr.includes('ellipse') || 
      rawShape === 4 || 
      rawShape === 6;

    if (isEllipse) {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const rx = w / 2;
      const ry = h / 2;
      return <ellipse key={index} cx={cx} cy={cy} rx={rx} ry={ry} {...commonProps} />;
    }

    // 3. HÌNH TRÒN
    const isCircle = 
      ((part.radius !== undefined || part.Radius !== undefined) && part.radiusX === undefined && part.RadiusX === undefined) ||
      shapeStr.includes('circle') || 
      rawShape === 2;

    if (isCircle) {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const r = Math.min(w, h) / 2;
      return <circle key={index} cx={cx} cy={cy} r={r} {...commonProps} />;
    }

    // 4. MẶC ĐỊNH: HÌNH CHỮ NHẬT
    // Bo góc tự điều chỉnh theo tỉ lệ kích thước (tránh biến hình chữ nhật nhỏ thành hình tròn)
    const cornerRadius = Math.min(w, h) > 20 ? 3 : 0;

    return (
      <rect
        key={index}
        x={x}
        y={y}
        width={w}
        height={h}
        {...commonProps}
      />
    );
  };

  const pad = 6;

  return (
    <div className="right-column">
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 className="preview-title">
          Kết Quả Tối Ưu {loading && <span style={{ color: '#3b82f6', fontSize: '1rem' }}>(Đang tính toán...)</span>}
        </h2>

        <div id="previewContainer" className="preview-box">
          <div 
            ref={exportRef} 
            style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#ffffff', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              padding: '8px'
            }}
          >
            <svg
              id="canvasSheet"
              width="100%"
              height="100%"
              viewBox={`${-pad} ${-pad} ${sheetW + pad * 2} ${sheetH + pad * 2}`}
              style={{
                width: '100%',
                height: '100%',
                flexGrow: 1,
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '0px',
                boxShadow: 'none',
                overflow: 'visible'
              }}
            >
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path 
                    d="M 10 0 L 0 0 0 10" 
                    fill="none" 
                    stroke="#cbd5e1" 
                    strokeWidth="1" 
                    vectorEffect="non-scaling-stroke" 
                  />
                </pattern>
              </defs>
              <rect width={sheetW} height={sheetH} fill="url(#grid)" />

              {/* Khung phôi nguyên */}
              <rect
                x="0"
                y="0"
                width={sheetW}
                height={sheetH}
                fill="none"
                stroke="#0f172a"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />

              {/* Các chi tiết cắt */}
              {currentSheetBoxes.length > 0 ? (
                currentSheetBoxes.map((box, index) => {
                  const w = Number(box.Width ?? box.width ?? 0);
                  const h = Number(box.Height ?? box.height ?? 0);
                  if (w === 0 || h === 0) return null;

                  const sizeKey = `${Math.min(w, h)}x${Math.max(w, h)}`;
                  const color = sizeColorMap.get(sizeKey) || AUTO_COLORS[0];

                  return renderShapeSVG(box, index, color);
                })
              ) : (
                <text 
                x={sheetW / 2} 
                y={sheetH / 2} 
                textAnchor="middle" 
                dominantBaseline="middle"
                fill="#94a3b8" 
                fontSize={Math.max(sheetH * 0.04, 3)} 
                fontWeight="600"
              >
                {loading 
                  ? "Đang xử lý thuật toán..." 
                  : hasResults 
                    ? "Tấm phôi này chưa được sử dụng" 
                    : "Nhấn \"BẮT ĐẦU TỐI ƯU\" để hiển thị sơ đồ cắt"}
              </text>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* STATS FOOTER */}
      <div className="stats-footer" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stats-group">
          <label className="stats-label">Hiển thị tấm kết quả:</label>
          <div className="stats-select-wrapper">
            <i className="fa-solid fa-layer-group stats-select-icon"></i>
            <select 
              className="stats-select" 
              value={selectedSheetIndex} 
              onChange={(e) => setSelectedSheetIndex(Number(e.target.value))}
            >
              {(hasResults ? containers : []).map((c, idx) => (
                <option key={c.id || idx} value={idx}>
                  {c.name || `Tấm ${idx + 1}`} ({c.width}x{c.height} cm)
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
            {/* ⚡ Hiển thị diện tích chuẩn cm² */}
            <span className="area-value">{usedArea.toLocaleString()} cm²</span>
            <span className="area-efficiency">({efficiency}%)</span>
          </div>
        </div>

        {/* Nút Xuất PDF */}
        <div className="stats-group" style={{ justifyContent: 'flex-end' }}>
          <label className="stats-label" style={{ opacity: 0 }}>Xuất File</label>
          <button
            onClick={handleExportPDF}
            disabled={!hasResults}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              backgroundColor: hasResults ? '#0284c7' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: hasResults ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fa-solid fa-file-pdf"></i> Xuất PDF
          </button>
        </div>
      </div>
    </div>
  );
}