import React from 'react';
import './PackingTables.css';

export default function ContainersTable({ containers, setContainers }) {

  const handleAddContainer = () => {
    const newContainer = {
      id: Date.now(),
      name: `Tấm Vật Liệu ${containers.length + 1}`,
      width: 1000,
      height: 800,
      quantity: 1
    };
    setContainers([...containers, newContainer]);
  };

  const handleDeleteContainer = (id) => {
    setContainers(containers.filter(c => c.id !== id));
  };

  // ⚡ Tự động nắn kích thước & số lượng tấm phôi < 1 về 1
  const handleUpdateContainer = (id, field, value) => {
    setContainers(containers.map(c => {
      if (c.id !== id) return c;
      if (field === 'name') return { ...c, name: value };
      if (value === '') return { ...c, [field]: '' };
      
      const val = Number(value);
      return { 
        ...c, 
        [field]: val < 1 ? 1 : val 
      };
    }));
  };

  return (
    <div className="packing-card containers-card">
      <div>
        <h2 className="card-title" style={{ fontSize: '1.125rem' }}>Tấm vật liệu</h2>
        
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '112px' }}>Tên tấm</th>
                <th>Dài</th>
                <th>Rộng</th>
                <th>Số lượng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {containers.map((container) => (
                <tr key={container.id}>
                  <td style={{ textAlign: 'left' }}>
                    <input 
                      type="text" 
                      value={container.name} 
                      onChange={(e) => handleUpdateContainer(container.id, 'name', e.target.value)}
                      onFocus={(e) => e.target.select()}
                      maxLength={50} 
                      className="input-name"
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1"
                      value={container.width ?? ''} 
                      onChange={(e) => handleUpdateContainer(container.id, 'width', e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="input-style" style={{ width: '64px' }}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1"
                      value={container.height ?? ''} 
                      onChange={(e) => handleUpdateContainer(container.id, 'height', e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="input-style" style={{ width: '64px' }}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1"
                      value={container.quantity ?? ''} 
                      onChange={(e) => handleUpdateContainer(container.id, 'quantity', e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="input-style" style={{ width: '48px' }}
                    />
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDeleteContainer(container.id)}>
                      <span style={{ fontStyle: 'normal' }}>✕</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4px' }}>
        <button className="btn-add" onClick={handleAddContainer} style={{ padding: '6px 24px' }}>
          <span style={{ fontStyle: 'normal' }}>Thêm</span>
        </button>
      </div>
    </div>
  );
}