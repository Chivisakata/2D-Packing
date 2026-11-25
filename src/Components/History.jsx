import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserHistoriesApi } from '../services/apiService';
import './PackingTables.css';

export default function History({ userSession, onLoadHistory, showToast }) {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // ⚡ Mỗi lần hiển thị tối đa 20 mục
  const navigate = useNavigate();

  useEffect(() => {
    if (!userSession?.userId) {
      showToast('Vui lòng đăng nhập để xem lịch sử!', 'warning');
      navigate('/login');
      return;
    }

    const fetchHistories = async () => {
      try {
        const data = await getUserHistoriesApi(userSession.userId);
        if (Array.isArray(data)) {
          setHistories(data);
        } else {
          setHistories([]);
        }
      } catch (err) {
        showToast('Không thể tải danh sách lịch sử!', 'error');
        setHistories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, [userSession, navigate, showToast]);

  const handleRestore = (history) => {
    const inputData = history.inputData || history.InputData;
    const resultData = history.resultData || history.ResultData;

    if (onLoadHistory) {
      onLoadHistory(inputData, resultData);
      showToast('Đã khôi phục sơ đồ cắt từ lịch sử!', 'success');
      navigate('/');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem' }}>Đang tải lịch sử...</div>;
  }

  // ⚡ Tính toán phân trang (20 mục / trang)
  const totalItems = histories.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentHistories = histories.slice(startIndex, startIndex + pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Lịch Sử Cắt Phôi
        </h1>
      </div>

      {histories.length === 0 ? (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
          Chưa có lịch sử cắt nào được lưu.
        </div>
      ) : (
        <>
          {/* ⚡ Giao diện danh sách (List Table) */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px', width: '60px', textAlign: 'center' }}>STT</th>
                  <th style={{ padding: '12px 16px' }}>Thời gian</th>
                  <th style={{ padding: '12px 16px', width: '130px', textAlign: 'center' }}>Tấm phôi</th>
                  <th style={{ padding: '12px 16px', width: '140px', textAlign: 'center' }}>Loại chi tiết</th>
                  <th style={{ padding: '12px 16px', width: '130px', textAlign: 'center' }}>Số hình đã xếp</th>
                  <th style={{ padding: '12px 16px', width: '160px', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {currentHistories.map((h, index) => {
                  const historyId = h.historyId || h.HistoryId;
                  const title = h.title || h.Title || 'Sơ đồ cắt phôi';
                  const rawDate = h.createdAt || h.CreatedAt;

                  let formattedDate = 'Không rõ thời gian';
                  if (rawDate && rawDate !== '0001-01-01T00:00:00Z') {
                    const parsedDate = new Date(rawDate);
                    if (!isNaN(parsedDate.getTime())) {
                      formattedDate = parsedDate.toLocaleString('vi-VN');
                    }
                  }

                  const inputData = h.inputData || h.InputData || {};
                  const resultData = h.resultData || h.ResultData || {};

                  const items = inputData.items || inputData.Items || [];
                  const containers = inputData.containers || inputData.Containers || [];
                  const placedBoxes = resultData.placedBoxes || resultData.PlacedBoxes || (Array.isArray(resultData) ? resultData : []);

                  const stt = startIndex + index + 1;

                  return (
                    <tr 
                      key={historyId || index}
                      style={{ 
                        borderBottom: '1px solid #f1f5f9', 
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: '0.9rem' }}>
                        {stt}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', marginBottom: '2px' }}>
                          {title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {formattedDate}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                        {containers.length} tấm
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                        {items.length} loại
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 800, color: '#334155', fontSize: '0.95rem' }}>
                        {placedBoxes.length} hình
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleRestore(h)}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                        >
                          Tải lại sơ đồ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ⚡ Thanh điều hướng phân trang (Chuyển 20 mục) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
              Hiển thị {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)} / tổng {totalItems} lịch sử
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#94a3b8' : '#334155',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                &laquo; Trang trước
              </button>

              <span style={{ padding: '0 8px', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Trang {currentPage} / {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages ? '#94a3b8' : '#334155',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Trang tiếp &raquo;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}