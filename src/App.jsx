import React, { useState, useEffect } from 'react';
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
import Contact from './Components/Contact'; 
import History from './Components/History';
import { calculateLayoutApi, saveHistoryApi } from './services/apiService';

function HomePage({ 
  userSession, 
  showToast,
  items,
  setItems,
  containers,
  setContainers,
  activeContainers,
  setActiveContainers,
  strategy,
  setStrategy,
  placedBoxes,
  setPlacedBoxes,
  loading,
  setLoading
}) {
  const handleReset = () => {
      setItems([
        { id: Date.now() + 1, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 100, h: 100 }, quantity: 5 },
      ]);
      setContainers([
        { id: Date.now(), name: 'Tấm A', width: 800, height: 800, quantity: 1 }
      ]);
      setActiveContainers([]);
      setStrategy('REMAINDER_OPTIMAL');
      setPlacedBoxes([]);
    };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const boxes = await calculateLayoutApi(items, containers, strategy);
      setActiveContainers(containers);
      setPlacedBoxes(boxes);
    } catch (err) {
      showToast(`Không thể tính toán tối ưu: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHistory = async () => {
    if (!userSession?.userId) {
      showToast('Bạn cần đăng nhập để lưu kết quả!', 'warning');
      return;
    }
    
    try {
      const inputData = { 
        items, 
        containers, 
        strategy 
      };
      
      const resultData = {
        placedBoxes,
        containers: activeContainers
      };
      
      const title = `Sơ đồ cắt phôi ngày ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

      await saveHistoryApi(userSession.userId, title, inputData, resultData);
      showToast('Đã lưu lịch sử cắt thành công!', 'success');
    } catch (err) {
      showToast(`Không thể lưu kết quả: ${err.message}`, 'error');
    }
  };

  const hasResults = placedBoxes && placedBoxes.length > 0;

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
            hasResults={hasResults}
            userSession={userSession}
            onSaveHistory={handleSaveHistory}
            onShowToast={showToast}
          />
        </div>

       <PreviewPanel 
          items={items} 
          containers={activeContainers} 
          placedBoxes={placedBoxes}
          loading={loading}
          userSession={userSession}
          onShowToast={showToast}
        />
      </div>

      <SeoSection />
    </main>
  );
}

export default function App() {
  const [userSession, setUserSession] = useState(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        localStorage.removeItem('userSession');
      }
    }
    return null;
  });

  const [toast, setToast] = useState(null);

  // ⚡ Dữ liệu khởi tạo chuẩn đơn vị cm
  // Trong component App -> khởi tạo state mặc định:
  const [items, setItems] = useState([
    { id: 1, shape: SHAPE_TYPES.RECTANGLE.id, dimensions: { w: 100, h: 100 }, quantity: 5 },
  ]);

  const [containers, setContainers] = useState([
    { id: 1, name: 'Tấm A', width: 800, height: 800, quantity: 1 }
  ]);

  const [activeContainers, setActiveContainers] = useState([]);
  const [strategy, setStrategy] = useState('REMAINDER_OPTIMAL');
  const [placedBoxes, setPlacedBoxes] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleLoadHistory = (inputData, resultData) => {
    if (inputData?.items) setItems(inputData.items);
    if (inputData?.containers) setContainers(inputData.containers);
    if (inputData?.strategy) setStrategy(inputData.strategy);

    const boxes = resultData?.placedBoxes || (Array.isArray(resultData) ? resultData : []);
    const activeConts = resultData?.containers || inputData?.containers || [];

    setPlacedBoxes(boxes);
    setActiveContainers(activeConts);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <Navbar userSession={userSession} onLogout={() => setUserSession(null)} />

      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              userSession={userSession} 
              showToast={showToast} 
              items={items}
              setItems={setItems}
              containers={containers}
              setContainers={setContainers}
              activeContainers={activeContainers}
              setActiveContainers={setActiveContainers}
              strategy={strategy}
              setStrategy={setStrategy}
              placedBoxes={placedBoxes}
              setPlacedBoxes={setPlacedBoxes}
              loading={loading}
              setLoading={setLoading}
            />
          } 
        />
        <Route path="/contact" element={<Contact />} />
        <Route 
          path="/login" 
          element={<Login onLoginSuccess={(user) => setUserSession(user)} />} 
        />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/history" 
          element={
            <History 
              userSession={userSession} 
              onLoadHistory={handleLoadHistory} 
              showToast={showToast} 
            />
          } 
        />
      </Routes>

      <Footer />
    </div>
  );
}