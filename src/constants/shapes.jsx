import React from 'react';

export const DEFAULT_SHAPE = 'RECTANGLE';

export const SHAPE_CONFIG = {
  RECTANGLE: {
    id: 'RECTANGLE',
    name: 'Hình chữ nhật',
    defaultDimensions: { w: 100, h: 100 },
    fields: [
      { key: 'w', width: 48 },
      { key: 'h', width: 48, separator: 'x' }
    ],
    toApiPayload: (dims) => ({
      ShapeName: 'Rectangle',
      Width: Number(dims?.w || 100),
      Height: Number(dims?.h || 100)
    })
  },
  CIRCLE: {
    id: 'CIRCLE',
    name: 'Hình tròn',
    defaultDimensions: { d: 100 },
    fields: [
      { key: 'd', prefix: 'Ø:', width: 64 }
    ],
    toApiPayload: (dims) => ({
      ShapeName: 'Circle',
      Radius: Number(dims?.d || 100) / 2
    })
  },
  HEXAGON: {
    id: 'HEXAGON',
    name: 'Lục giác đều',
    defaultDimensions: { a: 100 },
    fields: [
      { key: 'a', prefix: 'Cạnh:', width: 64 }
    ],
    toApiPayload: (dims) => ({
      ShapeName: 'RegularHexagon',
      SideLength: Number(dims?.a || 100)
    })
  },
  ELLIPSE: {
    id: 'ELLIPSE',
    name: 'Ellipse',
    defaultDimensions: { rx: 100, ry: 150 },
    fields: [
      { key: 'rx', width: 48 },
      { key: 'ry', width: 48, separator: 'x' }
    ],
    toApiPayload: (dims) => ({
      ShapeName: 'Ellipse',
      MajorAxis: Number(dims?.rx || 100),
      MinorAxis: Number(dims?.ry || 100)
    })
  }
};

export const SHAPE_LIST = Object.values(SHAPE_CONFIG);

// Nhận diện loại hình chuẩn từ dữ liệu đã chuẩn hóa của apiService
export function detectShapeId(cuttingPart = {}) {
  const rawShape = cuttingPart.shape ?? '';
  const shapeStr = String(rawShape).toLowerCase();

  if (cuttingPart.sideLength !== undefined || shapeStr.includes('hexagon') || rawShape === 3 || rawShape === 5) {
    return 'HEXAGON';
  }
  if (
    cuttingPart.radiusX !== undefined ||
    cuttingPart.majorAxis !== undefined ||
    shapeStr.includes('ellipse') ||
    rawShape === 4 ||
    rawShape === 6
  ) {
    return 'ELLIPSE';
  }
  if (
    (cuttingPart.radius !== undefined && cuttingPart.radiusX === undefined) ||
    shapeStr.includes('circle') ||
    rawShape === 2
  ) {
    return 'CIRCLE';
  }
  return 'RECTANGLE';
}

// Mô tả ngắn gọn hiển thị trong danh sách chi tiết trên tấm
const fmt = (n) => Number((Number(n) || 0).toFixed(2));

export function getBoxDescription(box) {
  const { width: w, height: h, cuttingPart = {} } = box;
  const shapeId = detectShapeId(cuttingPart);

  switch (shapeId) {
    case 'HEXAGON': {
      const side = cuttingPart.sideLength ?? Math.min(w, h) / 2;
      return `Lục giác đều (cạnh ${fmt(side)} cm)`;
    }
    case 'ELLIPSE':
      return `Ellipse (${fmt(w)}×${fmt(h)} cm)`;
    case 'CIRCLE':
      return `Hình tròn (Ø ${fmt(Math.min(w, h))} cm)`;
    default:
      return `Hình chữ nhật (${fmt(Math.min(w, h))}×${fmt(Math.max(w, h))} cm)`;
  }
}
// Vẽ SVG tương ứng cho từng hình
export function renderShapeSvg(box, index, color) {
  const { x, y, width: w, height: h, isRotated, cuttingPart = {} } = box;
  const shapeId = detectShapeId(cuttingPart);

  const commonProps = {
    fill: color,
    fillOpacity: '0.85',
    stroke: '#0f172a',
    strokeOpacity: '0.95',
    strokeWidth: '1.5',
    vectorEffect: 'non-scaling-stroke'
  };

  if (shapeId === 'HEXAGON') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = isRotated ? w / Math.sqrt(3) : w / 2;
    const ry = isRotated ? h / 2 : h / Math.sqrt(3);
    const angleOffset = isRotated ? Math.PI / 2 : 0;

    const points = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i + angleOffset;
      return `${(cx + rx * Math.cos(angle)).toFixed(2)},${(cy + ry * Math.sin(angle)).toFixed(2)}`;
    }).join(' ');

    return <polygon key={index} points={points} {...commonProps} />;
  }

  if (shapeId === 'ELLIPSE') {
    return (
      <ellipse
        key={index}
        cx={x + w / 2}
        cy={y + h / 2}
        rx={w / 2}
        ry={h / 2}
        {...commonProps}
      />
    );
  }

  if (shapeId === 'CIRCLE') {
    return (
      <circle
        key={index}
        cx={x + w / 2}
        cy={y + h / 2}
        r={Math.min(w, h) / 2}
        {...commonProps}
      />
    );
  }

  return <rect key={index} x={x} y={y} width={w} height={h} {...commonProps} />;
}