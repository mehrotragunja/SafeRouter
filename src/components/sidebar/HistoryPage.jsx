import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { getHist } from '../../utils/history';
import { fmtDist, fmtTime } from '../../utils/helpers';
import '../../styles/SubPages.css';

function HistoryPage() {
  const { setCurrentPage } = useContext(AppContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const hist = getHist();
    setHistory(hist || []);
  }, []);

  const levelColor = {
    Safe: '#43a047',
    Moderate: '#fb8c00',
    Risky: '#e53935'
  };

  return (
    <div className="sub-page on">
      <div className="sub-header">
        <button className="back-btn" onClick={() => setCurrentPage('map')}>←</button>
        <h2>Route History</h2>
      </div>

      <div className="sub-body">
        {history && history.length > 0 ? (
          <div className="history-list">
            {history.map((route, idx) => (
              <div key={idx} className="history-card">
                <div className="history-route">
                  <div className="route-from">📍 {route.from}</div>
                  <div className="route-arrow">→</div>
                  <div className="route-to">🎯 {route.to}</div>
                </div>

                <div className="history-meta">
                  <span>📏 {fmtDist(route.distance || 0)}</span>
                  <span>⏱️ {fmtTime(route.duration || 0)}</span>
                  <span
                    style={{
                      color: '#fff',
                      background: levelColor[route.level] || '#fb8c00',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}
                  >
                    {route.level}
                  </span>
                </div>

                <div className="history-time">
                  {new Date(route.time).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No route history yet</p>
            <p className="hint">Start navigating to see your routes here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
