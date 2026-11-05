import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import ItemsTable, { SHAPE_TYPES } from './Components/ItemsTable';
import ContainersTable from './Components/ContainersTable';
import OptimizationOptions from './Components/OptimizationOptions';
import PreviewPanel from './Components/PreviewPanel';
import SeoSection from './Components/SeoSection';
import Footer from './Components/Footer';
import { calculateLayoutApi } from './services/apiService';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 240, h: 170 }, quantity: 15 },
    { id: 2, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 125, h: 125 }, quantity: 10 },
    { id: 3, shape: SHAPE_TYPES.CIRCLE.id, dimensions: { d: 150 }, quantity: 5 },
  ]);

  const [containers, setContainers] = useState([
    { id: 1, name: 'Tấm A', width: 1200, height: 800, quantity: 1 }
  ]);

  const [strategy, setStrategy] = useState('REMAINDER_OPTIMAL');
  
  // ⚡ State lưu kết quả tọa độ BoundBox[] nhận từ API C#
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
    setPlacedBoxes([]); // Reset sơ đồ vẽ
  };

  // ⚡ Gọi API khi bấm "BẮT ĐẦU TỐI ƯU"
 const handleOptimize = async () => {
  setLoading(true);
  try {
    const boxes = await calculateLayoutApi(items, containers, strategy);
    console.log("🔥 [App.jsx] Đã set placedBoxes:", boxes);
    setPlacedBoxes(boxes); // Gán mảng đã chuẩn hóa vào State
  } catch (err) {
    alert(`Không thể tính toán tối ưu: ${err.message}`);
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />

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

          {/* Truyền cả items, containers và kết quả placedBoxes từ API vào PreviewPanel */}
          <PreviewPanel 
            items={items} 
            containers={containers} 
            placedBoxes={placedBoxes}
            loading={loading}
          />
        </div>

        <SeoSection />
      </main>

      <Footer />
    </div>
  );
}