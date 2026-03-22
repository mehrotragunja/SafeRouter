import React, { useEffect, useRef, useContext } from 'react';
import L from 'leaflet';
import { AppContext } from '../../context/AppContext';

// Fix Leaflet default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapView({ onReady }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  
  const { currentLocation, routeData } = useContext(AppContext);

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      // Default center: New Delhi
      const defaultLat = 28.6139;
      const defaultLng = 77.2090;

      map.current = L.map(mapContainer.current).setView([defaultLat, defaultLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles'
      }).addTo(map.current);

      onReady?.();
    }

    return () => {
      // Cleanup on unmount
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update current location marker
  useEffect(() => {
    if (!map.current || !currentLocation) return;

    // Remove old marker
    if (markerRef.current) {
      map.current.removeLayer(markerRef.current);
    }

    // Create rotating arrow marker
    const arrowIcon = createArrowMarker(currentLocation.bearing || 0);
    markerRef.current = L.marker(
      [currentLocation.lat, currentLocation.lng],
      { icon: arrowIcon }
    ).addTo(map.current);

    // Pan to current location
    map.current.panTo([currentLocation.lat, currentLocation.lng]);
  }, [currentLocation]);

  // Draw polyline when route changes
  useEffect(() => {
    if (!map.current || !routeData || !routeData.coords) return;

    // Remove old polyline
    if (polylineRef.current) {
      map.current.removeLayer(polylineRef.current);
    }

    const colors = {
      Safe: '#43a047',
      Moderate: '#fb8c00',
      Risky: '#e53935'
    };

    const color = colors[routeData.level] || '#fb8c00';

    polylineRef.current = L.polyline(routeData.coords, {
      color: color,
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map.current);

    // Fit map bounds to route
    const bounds = polylineRef.current.getBounds();
    map.current.fitBounds(bounds, { padding: [50, 50] });
  }, [routeData]);

  return (
    <div ref={mapContainer} className="map-container" id="map"></div>
  );
}

// Helper function to create rotating arrow marker
function createArrowMarker(bearing) {
  const arrowSvg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="16" fill="#e8637a" stroke="white" stroke-width="2.5" filter="url(#shadow)"/>
      <path d="M20 8 L26 20 L20 24 L14 20 Z" fill="white"/>
      <circle cx="20" cy="20" r="4" fill="white"/>
    </svg>
  `;

  const svgIcon = L.divIcon({
    html: `<div style="transform: rotate(${bearing}deg); transition: transform 0.3s ease;">${arrowSvg}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: 'arrow-marker'
  });

  return svgIcon;
}

export default MapView;
