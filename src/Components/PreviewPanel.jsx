import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePacking } from '../context/PackingContext';
import { getBoxDescription, renderShapeSvg } from '../constants/shapes';
import { exportLayoutToPdf } from '../utils/pdfExport';
import './PreviewPanel.css';

const AUTO_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#14b8a6', '#6366f1', '#a855f7'
];

export default function PreviewPanel() {
  const { activeContainers: containers, placedBoxes, loading, userSession, showToast } = usePacking();

  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [showPackedDropdown, setShowPackedDropdown] = useState(false);

  const exportRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPackedDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasResults = placedBoxes.length > 0 && containers.length > 0;
  const safeSheetIndex = selectedSheetIndex < containers.length ? selectedSheetIndex : 0;

  const currentSheet = hasResults ? containers[safeSheetIndex] : null;
  const sheetW = currentSheet ? Number(currentSheet.width) || 800 : 800;
  const sheetH = currentSheet ? Number(currentSheet.height) || 800 : 800;
  const currentSheetId = currentSheet?.id ?? safeSheetIndex + 1;

  const currentSheetBoxes = useMemo(
    () => (hasResults ? placedBoxes.filter((box) => box.stockSheetId === currentSheetId) : []),
    [hasResults, placedBoxes, currentSheetId]
  );

  const packedSummary = useMemo(() => {
    const counts = new Map();
    currentSheetBoxes.forEach((box) => {
      const label = getBoxDescription(box);
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    return Array.from(counts.entries());
  }, [currentSheetBoxes]);

  const sizeColorMap = useMemo(() => {
    const map = new Map();
    placedBoxes.forEach(({ width: w, height: h }) => {
      if (!w || !h) return;
      const key = `${Math.min(w, h)}x${Math.max(w, h)}`;
      if (!map.has(key)) {
        map.set(key, AUTO_COLORS[map.size % AUTO_COLORS.length]);
      }
    });
    return map;
  }, [placedBoxes]);

  const usedArea = currentSheetBoxes.reduce((sum, box) => sum + box.width * box.height, 0);
  const totalSheetArea = sheetW * sheetH;
  const efficiency = hasResults && totalSheetArea > 0
    ? ((usedArea / totalSheetArea) * 100).toFixed(2)
    : '0.00';

  const handleExportPDF = async () => {
    if (!userSession) {
      showToast('Bạn cần phải đăng nhập để xuất file PDF!', 'warning');
      return;
    }
    try {
      await exportLayoutToPdf({
        element: exportRef.current,
        sheetW,
        sheetH,
        sheetName: currentSheet?.name || `Tam ${safeSheetIndex + 1}`
      });
    } catch (error) {
      console.error('Lỗi xuất PDF:', error);
      showToast(`Không thể xuất PDF: ${error.message || 'Vui lòng thử lại!'}`, 'error');
    }
  };

  const pad = 6;

  return (
    <div className="right-column">
      <div className="preview-body">
        <h2 className="preview-title">
          Kết Quả Tối Ưu{' '}
          {loading && <span className="preview-loading-tag">(Đang tính toán...)</span>}
        </h2>

        <div id="previewContainer" className="preview-box">
          <div ref={exportRef} className="preview-export-stage">
            <svg
              id="canvasSheet"
              className="preview-canvas"
              width="100%"
              height="100%"
              viewBox={`${-pad} ${-pad} ${sheetW + pad * 2} ${sheetH + pad * 2}`}
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

              {currentSheetBoxes.length > 0 ? (
                currentSheetBoxes.map((box, index) => {
                  if (!box.width || !box.height) return null;
                  const sizeKey = `${Math.min(box.width, box.height)}x${Math.max(box.width, box.height)}`;
                  const color = sizeColorMap.get(sizeKey) || AUTO_COLORS[0];
                  return renderShapeSvg(box, index, color);
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
                    ? 'Đang xử lý thuật toán...'
                    : hasResults
                      ? 'Tấm phôi này chưa được sử dụng'
                      : 'Nhấn "BẮT ĐẦU TỐI ƯU" để hiển thị sơ đồ cắt'}
                </text>
              )}
            </svg>
          </div>
        </div>
      </div>

      <div className="stats-footer">
        <div className="stats-group">
          <label className="stats-label">Hiển thị tấm kết quả:</label>
          <div className="stats-select-wrapper">
            <i className="fa-solid fa-layer-group stats-select-icon"></i>
            <select
              className="stats-select"
              value={safeSheetIndex}
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

        <div className="stats-group" ref={dropdownRef}>
          <label className="stats-label">Chi tiết trên tấm này:</label>
          <button
            type="button"
            className="stats-unpacked-btn"
            onClick={() => setShowPackedDropdown((prev) => !prev)}
          >
            <span className="unpacked-text">
              <i className="fa-solid fa-circle-check packed-icon"></i>
              <span>{currentSheetBoxes.length} chi tiết đã xếp</span>
            </span>
            <i className="fa-solid fa-chevron-down chevron-icon"></i>
          </button>

          {showPackedDropdown && (
            <div className="unpacked-dropdown">
              <div className="unpacked-dropdown-header">Danh sách chi tiết đã xếp trên tấm</div>
              {packedSummary.length > 0 ? (
                packedSummary.map(([label, count]) => (
                  <div key={label} className="unpacked-item packed-item">
                    <span>• {label}</span>
                    <span className="packed-item-count">x{count}</span>
                  </div>
                ))
              ) : (
                <div className="packed-empty">Chưa có chi tiết nào trên tấm này</div>
              )}
            </div>
          )}
        </div>

        <div className="stats-group">
          <label className="stats-label">Diện tích sử dụng:</label>
          <div className="area-row">
            <span className="area-value">{usedArea.toLocaleString()} cm²</span>
            <span className="area-efficiency">({efficiency}%)</span>
          </div>
        </div>

        <div className="stats-group stats-group--end">
          <label className="stats-label stats-label--hidden">Xuất File</label>
          <button
            type="button"
            className="btn-export-pdf"
            onClick={handleExportPDF}
            disabled={!hasResults}
          >
            <i className="fa-solid fa-file-pdf"></i> Xuất PDF
          </button>
        </div>
      </div>
    </div>
  );
}