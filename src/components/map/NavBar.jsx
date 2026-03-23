import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { addToHist } from '../../utils/history';
import { fsAdd } from '../../firebase/firestore';
import { fmtDist, fmtTime } from '../../utils/helpers';
import '../../styles/MapPage.css';

function NavBar({ routeData }) {
  const { user, setRouteData, setIsNavigating, showToast, currentLocation } = useContext(AppContext);

  if (!routeData) return null;

  const handleStart = () => {
    setIsNavigating(true);
    showToast('Launching Google Maps navigation...', 'info');
    
    // Save route to history immediately when navigation starts
    if (routeData) {
      const routeEntry = {
        from: routeData.from,
        to: routeData.to,
        distance: routeData.distance,
        duration: routeData.duration,
        dLat: currentLocation?.lat || 0,
        dLng: currentLocation?.lng || 0,
        time: new Date().toISOString(),
        score: routeData.score,
        level: routeData.level
      };
      
      console.log('💾 Saving route to history:', routeEntry);
      addToHist(routeEntry, user?.uid, fsAdd, user?.idToken);
      showToast('Route saved to history!', 'success');
    }
    
    // Open Google Maps with the destination
    // Using Google Maps URI scheme for turn-by-turn navigation
    if (routeData.destination) {
      // Try to get the destination coordinates if available
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${routeData.destination}&travelmode=driving&dir_action=navigate`;
      window.open(googleMapsUrl, '_blank');
    } else if (routeData.to) {
      // Fallback: use destination name
      const encodedDest = encodeURIComponent(routeData.to);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDest}&travelmode=driving&dir_action=navigate`;
      window.open(googleMapsUrl, '_blank');
    } else {
      showToast('Could not launch navigation', 'error');
      setIsNavigating(false);
    }
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
