import React, { createContext, useContext, useState, useCallback } from 'react';
import { DEFAULT_SHAPE, SHAPE_CONFIG } from '../constants/shapes';
import { calculateLayoutApi, saveHistoryApi } from '../services/apiService';

const PackingContext = createContext(null);

const createDefaultItems = () => [
  {
    id: Date.now() + 1,
    shape: DEFAULT_SHAPE,
    dimensions: { ...SHAPE_CONFIG[DEFAULT_SHAPE].defaultDimensions },
    quantity: 5
  }
];

const createDefaultContainers = () => [
  { id: Date.now(), name: 'Tấm A', width: 800, height: 800, quantity: 1 }
];

const expandContainers = (list = []) => {
  const expanded = [];
  let sheetIdCounter = 1;

  list.forEach((c) => {
    const qty = Number(c.quantity) || 1;
    const width = Number(c.width) || 800;
    const height = Number(c.height) || 800;
    const name = c.name || 'Tấm phôi';

    for (let i = 0; i < qty; i++) {
      expanded.push({
        id: sheetIdCounter++,
        name: qty > 1 ? `${name} (#${i + 1})` : name,
        width,
        height,
        quantity: 1
      });
    }
  });

  return expanded;
};

export function PackingProvider({ children }) {
  const [userSession, setUserSession] = useState(() => {
    const saved = localStorage.getItem('userSession');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('userSession');
      return null;
    }
  });

  const [toast, setToast] = useState(null);
  const [items, setItems] = useState(createDefaultItems);
  const [containers, setContainers] = useState(createDefaultContainers);
  const [activeContainers, setActiveContainers] = useState([]);
  const [strategy, setStrategy] = useState('REMAINDER_OPTIMAL');
  const [placedBoxes, setPlacedBoxes] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const login = useCallback((user) => {
    localStorage.setItem('userSession', JSON.stringify(user));
    setUserSession(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userSession');
    setUserSession(null);
  }, []);

  const handleReset = useCallback(() => {
    setItems(createDefaultItems());
    setContainers(createDefaultContainers());
    setActiveContainers([]);
    setStrategy('REMAINDER_OPTIMAL');
    setPlacedBoxes([]);
  }, []);

  const handleOptimize = useCallback(async () => {
    setLoading(true);
    try {
      const { boxes, sheets } = await calculateLayoutApi(items, containers, strategy);
      setActiveContainers(sheets);
      setPlacedBoxes(boxes);
    } catch (err) {
      showToast(`Không thể tính toán tối ưu: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [items, containers, strategy, showToast]);

  const handleSaveHistory = useCallback(async () => {
    if (!userSession?.userId) {
      showToast('Bạn cần đăng nhập để lưu kết quả!', 'warning');
      return;
    }

    try {
      const now = new Date();
      const title = `Sơ đồ cắt phôi ngày ${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
      await saveHistoryApi(
        userSession.userId,
        title,
        { items, containers, strategy },
        { placedBoxes, containers: activeContainers }
      );
      showToast('Đã lưu lịch sử cắt thành công!', 'success');
    } catch (err) {
      showToast(`Không thể lưu kết quả: ${err.message}`, 'error');
    }
  }, [userSession, items, containers, strategy, placedBoxes, activeContainers, showToast]);

  const handleLoadHistory = useCallback((history) => {
    setItems(history.items);
    setContainers(history.containers);
    setStrategy(history.strategy);
    setPlacedBoxes(history.placedBoxes);

    const activeConts = history.activeContainers.some((c) => Number(c.quantity) > 1)
      ? expandContainers(history.activeContainers)
      : history.activeContainers;
    setActiveContainers(activeConts);
  }, []);

  return (
    <PackingContext.Provider
      value={{
        userSession,
        login,
        logout,
        toast,
        showToast,
        items,
        setItems,
        containers,
        setContainers,
        activeContainers,
        strategy,
        setStrategy,
        placedBoxes,
        loading,
        hasResults: placedBoxes.length > 0,
        handleReset,
        handleOptimize,
        handleSaveHistory,
        handleLoadHistory
      }}
    >
      {children}
    </PackingContext.Provider>
  );
}

export function usePacking() {
  const ctx = useContext(PackingContext);
  if (!ctx) throw new Error('usePacking phải được dùng bên trong PackingProvider');
  return ctx;
}