import React from 'react';
import { SHAPE_CONFIG, SHAPE_LIST, DEFAULT_SHAPE } from '../constants/shapes';
import { usePacking } from '../context/PackingContext';
import './PackingTables.css';

export default function ItemsTable() {
  const { items, setItems } = usePacking();

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        shape: DEFAULT_SHAPE,
        dimensions: { ...SHAPE_CONFIG[DEFAULT_SHAPE].defaultDimensions },
        quantity: 5
      }
    ]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleShapeChange = (id, newShape) => {
    const config = SHAPE_CONFIG[newShape] || SHAPE_CONFIG[DEFAULT_SHAPE];
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, shape: newShape, dimensions: { ...config.defaultDimensions } }
          : item
      )
    );
  };

  const handleDimensionChange = (id, key, value) => {
    if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) return;

    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, dimensions: { ...item.dimensions, [key]: value } }
          : item
      )
    );
  };

  const handleDimensionBlur = (id, key, value) => {
    const parsed = parseFloat(value);
    const validValue = !isNaN(parsed) && parsed > 0
      ? Math.round(parsed * 100) / 100
      : 1;

    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, dimensions: { ...item.dimensions, [key]: validValue } }
          : item
      )
    );
  };

  const handleQuantityChange = (id, qty) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const parsed = qty === '' ? '' : Math.max(1, Number(qty));
        return { ...item, quantity: parsed };
      })
    );
  };

  const renderDimensionInputs = (item) => {
    const config = SHAPE_CONFIG[item.shape] || SHAPE_CONFIG[DEFAULT_SHAPE];

    return (
      <div className="flex-center">
        {config.fields.map((field) => (
          <React.Fragment key={field.key}>
            {field.prefix && (
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{field.prefix}</span>
            )}
            {field.separator && (
              <span style={{ color: '#94a3b8' }}>{field.separator}</span>
            )}
           <input
              type="text"
              inputMode="decimal"
              value={item.dimensions[field.key] ?? ''}
              onChange={(e) => handleDimensionChange(item.id, field.key, e.target.value)}
              onBlur={(e) => handleDimensionBlur(item.id, field.key, e.target.value)}
              onFocus={(e) => e.target.select()}
              className="input-style"
              style={{ width: `${field.width}px` }}
            />
          </React.Fragment>
        ))}
      </div>
    );
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
                <th>Thông số (cm)</th>
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
                      className="select-style"
                      style={{ width: '100%' }}
                    >
                      {SHAPE_LIST.map((shape) => (
                        <option key={shape.id} value={shape.id}>
                          {shape.name}
                        </option>
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
                      className="input-style"
                      style={{ width: '48px', fontWeight: 'bold' }}
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