import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import ItemsTable, { SHAPE_TYPES } from './Components/ItemsTable';
import ContainersTable from './Components/ContainersTable';
import OptimizationOptions from './Components/OptimizationOptions';
import PreviewPanel from './Components/PreviewPanel';
import SeoSection from './Components/SeoSection';
import Footer from './Components/Footer';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, shape: 'RECTANGLE', dimensions: { w: 350, h: 200 }, quantity: 4 },
    { id: 2, shape: 'RECTANGLE', dimensions: { w: 200, h: 150 }, quantity: 6 },
    { id: 3, shape: 'RECTANGLE', dimensions: { w: 120, h: 120 }, quantity: 8 },
    { id: 4, shape: 'CIRCLE',    dimensions: { d: 180 },        quantity: 3 },
    { id: 5, shape: 'RECTANGLE', dimensions: { w: 500, h: 100 }, quantity: 2 },
  ]);

 const [containers, setContainers] = useState([
    { id: 1, name: 'Tấm A (Chuẩn)', width: 1200, height: 800, quantity: 1 },
    { id: 2, name: 'Tấm B (Nhỏ)',   width: 800,  height: 600, quantity: 1 }
  ]);

  const [strategy, setStrategy] = useState('REMAINDER_OPTIMAL');

  const handleReset = () => {
    setItems([
      { id: Date.now() + 1, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 240, h: 170 }, quantity: 15 },
      { id: Date.now() + 2, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 125, h: 125 }, quantity: 10 },
      { id: Date.now() + 3, shape: SHAPE_TYPES.CIRCLE.id, dimensions: { d: 150 }, quantity: 5 },
    ]);
    setContainers([
      { id: Date.now(), name: 'Tấm A', width: 1200, height: 800, quantity: 1 }
    ]);
    setStrategy('REMAINDER_OPTIMAL');
  };

  const handleOptimize = () => {
    console.log("Bắt đầu tối ưu:", { items, containers, strategy });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />

      <main className="main-container">
        
        {/* Tiêu đề */}
        <div className="header-title">
          <h1>2D Packing & Cutting Calculator</h1>
          <p>Công Cụ Ước Tính & Tối Ưu Bố Trí Cắt Chi Tiết Đa Dạng Hình Dạng</p>
        </div>

        {/* Bố cục 2 cột chính */}
        <div className="layout-grid">
          
          {/* Cột trái: 3 Khung + Nút thao tác */}
          <div className="left-column">
            <ItemsTable items={items} setItems={setItems} />
            <ContainersTable containers={containers} setContainers={setContainers} />
            <OptimizationOptions 
              strategy={strategy} 
              setStrategy={setStrategy} 
              onReset={handleReset}
              onOptimize={handleOptimize}
            />
          </div>

          {/* Cột phải: Khung Preview SVG */}
          <PreviewPanel items={items} containers={containers} />

        </div>

        {/* Khung bài viết hướng dẫn / SEO */}
        <SeoSection />

      </main>

      {/* Footer chân trang */}
      <Footer />
    </div>
  );
}