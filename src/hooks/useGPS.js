import { useEffect, useRef, useCallback } from 'react';

/**
 * Calculate distance between two lat/lng points (Haversine formula)
 */
export function haverDist(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/**
 * Calculate bearing between two lat/lng points
 */
export function calcBearing(lat1, lng1, lat2, lng2) {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360; // Normalize to 0-360
}

/**
 * useGPS hook - watch user position and handle geolocation
 */
export function useGPS() {
  const watchIdRef = useRef(null);
  const prevLocationRef = useRef(null);

  const startWatching = useCallback((onPositionChange, options = {}) => {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      ...options
    };

    // Stop previous watch if exists
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Calculate bearing if we have previous location
        let bearing = 0;
        if (prevLocationRef.current) {
          bearing = calcBearing(
            prevLocationRef.current.lat,
            prevLocationRef.current.lng,
            latitude,
            longitude
          );
        }
        
        const newLocation = {
          lat: latitude,
          lng: longitude,
          accuracy,
          bearing
        };
        
        prevLocationRef.current = newLocation;
        onPositionChange(newLocation);
      },
      (error) => {
        console.error('GPS error:', error);
      },
      defaultOptions
    );
  }, []);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const getCurrentPosition = useCallback((onSuccess, onError) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        onSuccess({
          lat: latitude,
          lng: longitude,
          accuracy
        });
      },
      (error) => {
        console.error('GPS error:', error);
        onError?.(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000
      }
    );
  }, []);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    startWatching,
    stopWatching,
    getCurrentPosition,
    haverDist,
    calcBearing
  };
}
