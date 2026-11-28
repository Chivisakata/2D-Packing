import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PackingProvider, usePacking } from './context/PackingContext';
import Navbar from './Components/Navbar';
import ItemsTable from './Components/ItemsTable';
import ContainersTable from './Components/ContainersTable';
import OptimizationOptions from './Components/OptimizationOptions';
import PreviewPanel from './Components/PreviewPanel';
import SeoSection from './Components/SeoSection';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Register from './Components/Register';
import Contact from './Components/Contact';
import History from './Components/History';

function HomePage() {
  return (
    <main className="main-container">
      <div className="header-title">
        <h1>2D Packing & Cutting Calculator</h1>
        <p>Công Cụ Ước Tính & Tối Ưu Bố Trí Cắt Chi Tiết Đa Dạng Hình Dạng</p>
      </div>

      <div className="layout-grid">
        <div className="left-column">
          <ItemsTable />
          <ContainersTable />
          <OptimizationOptions />
        </div>

        <PreviewPanel />
      </div>

      <SeoSection />
    </main>
  );
}

function AppShell() {
  const { toast } = usePacking();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <Navbar />

      <Routes>
       <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<div className="main-container"><h1>404 - Không tìm thấy trang</h1></div>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PackingProvider>
      <AppShell />
    </PackingProvider>
  );
}