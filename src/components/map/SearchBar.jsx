import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { geocodeAddress, genRoute } from '../../utils/routing';
import { generateSafetyScore, getSafetyLevel } from '../../utils/helpers';
import { fmtDist } from '../../utils/helpers';
import '../../styles/MapPage.css';

function SearchBar() {
  const { setRouteData, setIsNavigating, showToast, currentLocation } = useContext(AppContext);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('Locating...');

  // Get location name from coordinates
  useEffect(() => {
    if (currentLocation) {
      const fetchLocationName = async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLocation.lat}&lon=${currentLocation.lng}`
          );
          const data = await res.json();
          const name = data.address?.city || data.address?.town || data.address?.village || data.name || 'Current Location';
          setLocationName(name);
          setOrigin(name);
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setLocationName('Current Location');
          setOrigin('Current Location');
        }
      };
      fetchLocationName();
    }
  }, [currentLocation]);

  const handleGo = async () => {
    if (!destination.trim()) {
      showToast('Enter destination', 'error');
      return;
    }

    if (!currentLocation) {
      showToast('Waiting for GPS location...', 'error');
      return;
    }

    setLoading(true);
    try {
      console.log('Starting route search with:', {
        origin: currentLocation,
        destination: destination.trim()
      });
      
      // Use current location as origin
      const fromGeo = currentLocation;
      
      // Geocode destination
      const toGeo = await geocodeAddress(destination);

      console.log('Geocoding results:', { fromGeo, toGeo });

      if (!toGeo) {
        throw new Error('Destination location not found. Try a more specific location name.');
      }

      // Generate route
      const route = await genRoute(fromGeo, toGeo);
      
      console.log('Route generated:', route);
      
      // Generate safety score based on route characteristics
      const score = generateSafetyScore({
        distance: route.distance,
        duration: route.duration
      });
      const safetyInfo = getSafetyLevel(score);

      // Set route data
      setRouteData({
        from: 'Current Location',
        to: destination,
        coords: route.coords,
        distance: route.distance,
        duration: route.duration,
        score,
        level: safetyInfo.level
      });

      setIsNavigating(false);
      showToast(`Route found! Distance: ${fmtDist(route.distance)}, Safety: ${safetyInfo.level}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to find route', 'error');
      console.error('Route error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGo();
    }
  };

  return (
    <div className="map-search glass">
      <div className="search-row">
        <div className="sdot-map" style={{ background: 'var(--r)' }}></div>
        <input
          className="s-inp"
          type="text"
          placeholder="Current Location"
          value={locationName}
          disabled={true}
          style={{ opacity: 0.7, cursor: 'default' }}
        />
      </div>

      <div className="search-sep">
        <div className="sep-line"></div>
      </div>

      <div className="search-row">
        <div className="sdot-map" style={{ background: 'var(--safe)' }}></div>
        <input
          className="s-inp"
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          autoComplete="off"
        />
        <button
          className="go-btn"
          onClick={handleGo}
          disabled={loading || !currentLocation}
          title="Find route"
        >
          {loading ? '⊙' : '→'}
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
