import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { fmtDist, fmtTime } from '../../utils/helpers';
import '../../styles/MapPage.css';

function NavBar({ routeData }) {
  const { setRouteData, setIsNavigating, showToast } = useContext(AppContext);

  if (!routeData) return null;

  const handleStart = () => {
    setIsNavigating(true);
    showToast('Navigation started! Stay alert and follow the highlighted route.', 'info');
  };

  const handleClear = () => {
    setRouteData(null);
    setIsNavigating(false);
    showToast('Route cleared', 'info');
  };

  const colorMap = {
    Safe: '#43a047',
    Moderate: '#fb8c00',
    Risky: '#e53935'
  };

  return (
    <div className="nav-bar">
      <div className="nav-content">
        <div className="nav-left">
          <div className="nav-title">
            <div className="nav-label">Navigating to</div>
            <div className="nav-destination">{routeData.to}</div>
          </div>
        </div>

        <div className="nav-stats">
          <div className="nav-stat">
            <div className="nav-value">{fmtDist(routeData.distance)}</div>
            <div className="nav-unit">distance</div>
          </div>

          <div className="nav-stat">
            <div className="nav-value">{fmtTime(routeData.duration)}</div>
            <div className="nav-unit">eta</div>
          </div>

          <div
            className="nav-badge"
            style={{ background: colorMap[routeData.level] || '#fb8c00' }}
          >
            {routeData.level}
          </div>
        </div>
      </div>

      <div className="nav-actions">
        <button className="btn btn-rose" onClick={handleStart} style={{ flex: 1 }}>
          ▶ Start Navigation
        </button>
        <button 
          className="btn btn-ghost" 
          onClick={handleClear}
          style={{ 
            padding: '12px 18px', 
            width: 'auto',
            color: 'var(--r)',
            background: 'rgba(232,99,122,.1)',
            border: '1.5px solid rgba(232,99,122,.25)'
          }}
        >
          ✕ Clear
        </button>
      </div>
    </div>
  );
}

export default NavBar;
