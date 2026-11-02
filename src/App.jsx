import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import ItemsTable, { SHAPE_TYPES } from './Components/ItemsTable';
import ContainersTable from './Components/ContainersTable';
import PreviewPanel from './Components/PreviewPanel';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 240, h: 170 }, quantity: 15 },
    { id: 2, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 125, h: 125 }, quantity: 10 },
    { id: 3, shape: SHAPE_TYPES.CIRCLE.id, dimensions: { d: 150 }, quantity: 5 },
  ]);

  const [containers, setContainers] = useState([
    { id: 1, name: 'Tấm A', width: 1200, height: 800, quantity: 1 }
  ]);

  return (
    <div>
      <Navbar />

      <main className="main-container">
        
        {/* Tiêu đề */}
        <div className="header-title">
          <h1>2D Packing & Cutting Calculator</h1>
          <p>Công Cụ Ước Tính & Tối Ưu Bố Trí Cắt Chi Tiết Đa Dạng Hình Dạng</p>
        </div>

        {/* ⚡ BỐ CỤC 2 CỘT SONG SONG BẰNG CSS THUẦN */}
        <div className="layout-grid">
          
          {/* Cột trái (550px): 2 Khung bảng */}
          <div className="left-column">
            <ItemsTable items={items} setItems={setItems} />
            <ContainersTable containers={containers} setContainers={setContainers} />
          </div>

          {/* Cột phải: Khung Preview (ĐÃ TRUYỀN PROPS DỮ LIỆU) */}
          <PreviewPanel items={items} containers={containers} />

        </div>

      </main>
    </div>
  );
}