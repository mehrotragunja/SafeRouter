import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { signOut } from '../firebase';
import { auth } from '../firebase';
import './MapPage.css';

// Fix leaflet default icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapPage({ user, onLogout }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const watchIdRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if map is already initialized
    if (map.current) return;

    // Initialize map with a default view
    map.current = L.map(mapContainer.current).setView([28.61, 77.23], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Get current position first, then watch for updates
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentLocation({ lat, lng });
        
        // Center map on current location
        if (map.current) {
          map.current.setView([lat, lng], 15);
        }
        
        // Add marker for current location
        if (markerRef.current) {
          map.current.removeLayer(markerRef.current);
        }
        markerRef.current = L.marker([lat, lng]).addTo(map.current);
      },
      (err) => {
        console.error('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );

    // Watch position for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCurrentLocation({ lat, lng });

        // Remove old marker
        if (markerRef.current) {
          map.current.removeLayer(markerRef.current);
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng]).addTo(map.current);
        map.current.setView([lat, lng], 15);
      },
      (err) => {
        console.error('Geolocation watch error:', err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      // Properly clean up the map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const handleSOS = () => {
    if (currentLocation) {
      const { lat, lng } = currentLocation;
      window.open(
        `https://wa.me/?text=HELP https://maps.google.com/?q=${lat},${lng}`
      );
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        window.open(
          `https://wa.me/?text=HELP https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
        );
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="map-page">
      <div ref={mapContainer} className="map-container"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">Safe Router 🌸</div>
        <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </nav>

      {/* Menu */}
      {menuOpen && (
        <div className="nav-menu">
          <div className="menu-header">
            <p className="menu-user">{user?.email}</p>
            <button
              className="menu-close"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
          </div>
          <button className="menu-item logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* SOS Button */}
      <button className="sos-btn" onClick={handleSOS} title="Send SOS">
        🆘
      </button>

      {/* Location Info */}
      {currentLocation && (
        <div className="location-info">
          <p>📍 {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}

export default MapPage;
