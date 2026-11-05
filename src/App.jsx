import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import ItemsTable, { SHAPE_TYPES } from './Components/ItemsTable';
import ContainersTable from './Components/ContainersTable';
import OptimizationOptions from './Components/OptimizationOptions';
import PreviewPanel from './Components/PreviewPanel';
import SeoSection from './Components/SeoSection';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Register from './Components/Register';
import { calculateLayoutApi } from './services/apiService';

// Component chứa toàn bộ giao diện Trang chủ cắt 2D
function HomePage() {
  const [items, setItems] = useState([
    { id: 1, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 240, h: 170 }, quantity: 15 },
    { id: 2, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 125, h: 125 }, quantity: 10 },
    { id: 3, shape: SHAPE_TYPES.CIRCLE.id, dimensions: { d: 150 }, quantity: 5 },
  ]);

  const [containers, setContainers] = useState([
    { id: 1, name: 'Tấm A', width: 1200, height: 800, quantity: 1 }
  ]);

  const [strategy, setStrategy] = useState('REMAINDER_OPTIMAL');
  const [placedBoxes, setPlacedBoxes] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setPlacedBoxes([]);
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const boxes = await calculateLayoutApi(items, containers, strategy);
      setPlacedBoxes(boxes);
    } catch (err) {
      alert(`Không thể tính toán tối ưu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-container">
      <div className="header-title">
        <h1>2D Packing & Cutting Calculator</h1>
        <p>Công Cụ Ước Tính & Tối Ưu Bố Trí Cắt Chi Tiết Đa Dạng Hình Dạng</p>
      </div>

      <div className="layout-grid">
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

        <PreviewPanel 
          items={items} 
          containers={containers} 
          placedBoxes={placedBoxes}
          loading={loading}
        />
      </div>

      <SeoSection />
    </main>
  );
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </div>
  );
}