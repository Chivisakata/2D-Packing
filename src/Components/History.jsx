import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserHistoriesApi } from '../services/apiService';
import { usePacking } from '../context/PackingContext';
import './History.css';

export default function History() {
  const { userSession, handleLoadHistory, showToast } = usePacking();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userSession?.userId) {
      showToast('Vui lòng đăng nhập để xem lịch sử!', 'warning');
      navigate('/login');
      return;
    }

    getUserHistoriesApi(userSession.userId)
      .then(setHistories)
      .catch(() => {
        showToast('Không thể tải danh sách lịch sử!', 'error');
        setHistories([]);
      })
      .finally(() => setLoading(false));
  }, [userSession, navigate, showToast]);

  const handleRestore = (history) => {
    handleLoadHistory(history);
    showToast('Đã khôi phục sơ đồ cắt từ lịch sử!', 'success');
    navigate('/');
  };

  if (loading) {
    return <div className="history-loading">Đang tải lịch sử...</div>;
  }

  const totalItems = histories.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentHistories = histories.slice(startIndex, startIndex + pageSize);

  return (
    <div className="history-container">
      <div className="history-header">
        <h1 className="history-title">Lịch Sử Cắt Phôi</h1>
      </div>

      {histories.length === 0 ? (
        <div className="history-empty">
          Chưa có lịch sử cắt nào được lưu.
        </div>
      ) : (
        <>
          <div className="history-table-card">
            <table className="history-table">
              <thead>
                <tr>
                  <th className="history-col-stt">STT</th>
                  <th>Thời gian</th>
                  <th className="history-col-sheets">Tấm phôi</th>
                  <th className="history-col-types">Loại chi tiết</th>
                  <th className="history-col-placed">Số hình đã xếp</th>
                  <th className="history-col-action"></th>
                </tr>
              </thead>
              <tbody>
                {currentHistories.map((h, index) => (
                  <tr key={h.historyId || index} className="history-row">
                    <td className="history-stt">{startIndex + index + 1}</td>
                    <td>
                      <div className="history-row-title">{h.title}</div>
                    </td>
                    <td className="history-row-count">{h.containers.length} tấm</td>
                    <td className="history-row-count">{h.items.length} loại</td>
                    <td className="history-row-placed">{h.placedBoxes.length} hình</td>
                    <td className="history-col-center">
                      <button
                        type="button"
                        className="btn-restore"
                        onClick={() => handleRestore(h)}
                      >
                        Tải lại sơ đồ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="history-pagination">
            <span className="history-pagination-info">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)} / tổng {totalItems} lịch sử
            </span>

            <div className="history-pagination-controls">
              <button
                type="button"
                className="btn-page"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &laquo; Trang trước
              </button>

              <span className="history-page-indicator">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                className="btn-page"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
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