import React from 'react';
import './PackingTables.css'; // Import CSS thuần

export const SHAPE_TYPES = {
  RECTANGLE: { id: 'RECTANGLE', name: 'Hình chữ nhật' },
  CIRCLE: { id: 'CIRCLE', name: 'Hình tròn' },
  RIGHT_TRIANGLE: { id: 'RIGHT_TRIANGLE', name: 'Tam giác vuông' },
  ISOSCELES_TRIANGLE: { id: 'ISOSCELES_TRIANGLE', name: 'Tam giác cân' },
  HEXAGON: { id: 'HEXAGON', name: 'Lục giác đều' },
  ELLIPSE: { id: 'ELLIPSE', name: 'Ellipse' }
};

export default function ItemsTable({ items, setItems }) {

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      shape: SHAPE_TYPES.RECTANGLE.id,
      dimensions: { w: 240, h: 170 },
      quantity: 5
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleShapeChange = (id, newShape) => {
    let defaultDims = { w: 200, h: 200 };
    if (newShape === SHAPE_TYPES.CIRCLE.id) defaultDims = { d: 150 };
    if (newShape === SHAPE_TYPES.HEXAGON.id) defaultDims = { a: 200 };
    if (newShape === SHAPE_TYPES.ELLIPSE.id) defaultDims = { rx: 200, ry: 150 };

    setItems(items.map(item => 
      item.id === id ? { ...item, shape: newShape, dimensions: defaultDims } : item
    ));
  };

  const handleDimensionChange = (id, key, value) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, dimensions: { ...item.dimensions, [key]: Number(value) || 0 } } 
        : item
    ));
  };

  const handleQuantityChange = (id, qty) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Number(qty) || 1 } : item
    ));
  };

  const renderDimensionInputs = (item) => {
    const { shape, dimensions } = item;

    switch (shape) {
      case SHAPE_TYPES.CIRCLE.id:
        return (
          <div className="flex-center">
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Ø:</span>
            <input 
              type="number" 
              value={dimensions.d || 150} 
              onChange={(e) => handleDimensionChange(item.id, 'd', e.target.value)}
              className="input-style" style={{ width: '64px' }}
            />
          </div>
        );
      case SHAPE_TYPES.RIGHT_TRIANGLE.id:
      case SHAPE_TYPES.ISOSCELES_TRIANGLE.id:
        return (
          <div className="flex-center">
            <input 
              type="number" 
              value={dimensions.b || 300} 
              onChange={(e) => handleDimensionChange(item.id, 'b', e.target.value)}
              className="input-style" style={{ width: '48px' }}
            />
            <span style={{ color: '#94a3b8' }}>x</span>
            <input 
              type="number" 
              value={dimensions.h || 400} 
              onChange={(e) => handleDimensionChange(item.id, 'h', e.target.value)}
              className="input-style" style={{ width: '48px' }}
            />
          </div>
        );
      case SHAPE_TYPES.RECTANGLE.id:
      default:
        return (
          <div className="flex-center">
            <input 
              type="number" 
              value={dimensions.w || 240} 
              onChange={(e) => handleDimensionChange(item.id, 'w', e.target.value)}
              className="input-style" style={{ width: '48px' }}
            />
            <span style={{ color: '#94a3b8' }}>x</span>
            <input 
              type="number" 
              value={dimensions.h || 170} 
              onChange={(e) => handleDimensionChange(item.id, 'h', e.target.value)}
              className="input-style" style={{ width: '48px' }}
            />
          </div>
        );
    }
  };

  return (
    <div className="packing-card items-card">
      <div>
        <h2 className="card-title">Chi tiết cần cắt</h2>
        
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '140px' }}>Hình dạng</th>
                <th>Thông số (mm)</th>
                <th style={{ width: '64px' }}>Số lượng</th>
                <th style={{ width: '32px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'left' }}>
                    <select 
                      value={item.shape} 
                      onChange={(e) => handleShapeChange(item.id, e.target.value)}
                      className="select-style" style={{ width: '100%' }}
                    >
                      {Object.values(SHAPE_TYPES).map(shape => (
                        <option key={shape.id} value={shape.id}>{shape.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>{renderDimensionInputs(item)}</td>
                  <td>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="input-style" style={{ width: '48px', fontWeight: 'bold' }}
                    />
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDeleteItem(item.id)}>
                      <span style={{ fontStyle: 'normal' }}>✕</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
        <button className="btn-add" onClick={handleAddItem}>
            <span style={{ fontStyle: 'normal' }}>Thêm</span>
        </button>
      </div>
    </div>
  );
}