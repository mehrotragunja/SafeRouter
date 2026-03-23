import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useGPS } from '../hooks/useGPS';
import MapView from '../components/map/MapView';
import SearchBar from '../components/map/SearchBar';
import SOSButton from '../components/map/SOSButton';
import NavBar from '../components/map/NavBar';
import Sidebar from '../components/sidebar/Sidebar';
import '../styles/MapPage.css';

function MapPage({ onLogout }) {
  const { 
    profile, 
    routeData, 
    isNavigating, 
    sidebarOpen, 
    setSidebarOpen,
    currentLocation,
    setCurrentLocation 
  } = useContext(AppContext);
  
  const { getCurrentPosition, startWatching } = useGPS();

  useEffect(() => {
    // Get initial position
    getCurrentPosition((pos) => {
      setCurrentLocation(pos);
      console.log('Initial position:', pos);
    });

    // Watch position continuously
    const unwatch = startWatching((pos) => {
      setCurrentLocation(pos);
    });

    return () => {
      if (unwatch) unwatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="map-page">
      {/* Background orbs */}
      <div className="map-orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
      </div>

      {/* Map container with blur when sidebar open */}
      <div className={`map-wrapper ${sidebarOpen ? 'blur' : ''}`}>
        <MapView onReady={() => console.log('Map ready')} />
      </div>

      {/* Profile FAB */}
      <button 
        className="pfab" 
        onClick={() => setSidebarOpen(true)}
        title="Open menu"
      >
        👤
      </button>

      {/* Search bar - only show when not navigating */}
      {!isNavigating && <SearchBar />}

      {/* Navigation bar - show when route exists (whether navigating or not) */}
      {routeData && <NavBar routeData={routeData} />}

      {/* Safety pill - show during navigation */}
      {routeData && isNavigating && (
        <div className="safe-pill on">
          <span className="pill-label">Route Safety:</span>
          <span className={`sbadge level-${routeData.level.toLowerCase()}`}>
            {routeData.level}
          </span>
          <span className="pill-score">{routeData.score}/100</span>
        </div>
      )}

      {/* Route legend - show during navigation */}
      {routeData && isNavigating && (
        <div className="r-legend on">
          <div className="leg-item">
            <div className="leg-dot" style={{ background: '#43a047' }}></div>
            <span>Safe</span>
          </div>
          <div className="leg-item">
            <div className="leg-dot" style={{ background: '#fb8c00' }}></div>
            <span>Moderate</span>
          </div>
          <div className="leg-item">
            <div className="leg-dot" style={{ background: '#e53935' }}></div>
            <span>Risky</span>
          </div>
        </div>
      )}

      {/* SOS Button */}
      <SOSButton contact={profile?.contact1} location={currentLocation} />

      {/* Sidebar */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} onLogout={onLogout} />}
    </div>
  );
}

export default MapPage;
