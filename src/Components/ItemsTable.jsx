import React from 'react';
import './PackingTables.css';

export const SHAPE_TYPES = {
  RECTANGLE: { id: 'RECTANGLE', name: 'Hình chữ nhật' },
  CIRCLE: { id: 'CIRCLE', name: 'Hình tròn' },
  HEXAGON: { id: 'HEXAGON', name: 'Lục giác đều' },
  ELLIPSE: { id: 'ELLIPSE', name: 'Ellipse' }
};

export default function ItemsTable({ items, setItems }) {

 const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      shape: SHAPE_TYPES.RECTANGLE.id,
      dimensions: { w: 100, h: 100 },
      quantity: 5
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleShapeChange = (id, newShape) => {
    let defaultDims = { w: 100, h: 100 };
    if (newShape === SHAPE_TYPES.CIRCLE.id) defaultDims = { d: 100 };
    if (newShape === SHAPE_TYPES.HEXAGON.id) defaultDims = { a: 100 };
    if (newShape === SHAPE_TYPES.ELLIPSE.id) defaultDims = { rx: 100, ry: 150 };

    setItems(items.map(item => 
      item.id === id ? { ...item, shape: newShape, dimensions: defaultDims } : item
    ));
  };

  // ⚡ Tự động nắn giá trị < 1 về 1 (giữ '' nếu xóa hết)
  const handleDimensionChange = (id, key, value) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      if (value === '') return { ...item, dimensions: { ...item.dimensions, [key]: '' } };
      const val = Number(value);
      return { 
        ...item, 
        dimensions: { 
          ...item.dimensions, 
          [key]: val < 1 ? 1 : val 
        } 
      };
    }));
  };

  const handleQuantityChange = (id, qty) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      if (qty === '') return { ...item, quantity: '' };
      const val = Number(qty);
      return { ...item, quantity: val < 1 ? 1 : val };
    }));
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
              min="1"
              value={dimensions.d ?? ''} 
              onChange={(e) => handleDimensionChange(item.id, 'd', e.target.value)}
              onFocus={(e) => e.target.select()}
              className="input-style" style={{ width: '64px' }}
            />
          </div>
        );
      case SHAPE_TYPES.HEXAGON.id:
        return (
          <div className="flex-center">
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Cạnh:</span>
            <input 
              type="number" 
              min="1"
              value={dimensions.a ?? ''} 
              onChange={(e) => handleDimensionChange(item.id, 'a', e.target.value)}
              onFocus={(e) => e.target.select()}
              className="input-style" style={{ width: '64px' }}
            />
          </div>
        );
      case SHAPE_TYPES.ELLIPSE.id:
        return (
          <div className="flex-center">
            <input 
              type="number" 
              min="1"
              value={dimensions.rx ?? ''} 
              onChange={(e) => handleDimensionChange(item.id, 'rx', e.target.value)}
              onFocus={(e) => e.target.select()}
              className="input-style" style={{ width: '48px' }}
            />
            <span style={{ color: '#94a3b8' }}>x</span>
            <input 
              type="number" 
              min="1"
              value={dimensions.ry ?? ''} 
              onChange={(e) => handleDimensionChange(item.id, 'ry', e.target.value)}
              onFocus={(e) => e.target.select()}
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
              min="1"
              value={dimensions.w ?? ''} 
              onChange={(e) => handleDimensionChange(item.id, 'w', e.target.value)}
              onFocus={(e) => e.target.select()}
              className="input-style" style={{ width: '48px' }}
            />
            <span style={{ color: '#94a3b8' }}>x</span>
            <input 
              type="number" 
              min="1"
              value={dimensions.h ?? ''} 
              onChange={(e) => handleDimensionChange(item.id, 'h', e.target.value)}
              onFocus={(e) => e.target.select()}
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
              <th>Thông số (cm)</th> {/* ⚡ Đã đổi mm -> cm */}
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
                      min="1"
                      value={item.quantity ?? ''} 
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      onFocus={(e) => e.target.select()}
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