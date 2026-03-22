/**
 * Route generation using Nominatim (geocoding) + OSRM (routing)
 */

export async function geocodeAddress(query) {
  try {
    // Add India bias for better address resolution
    const params = new URLSearchParams({
      format: 'json',
      q: query,
      limit: 1,
      countrycodes: 'in',  // India country code
      viewbox: '68.1,8.0,97.4,35.5'  // India bounding box
    });
    
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`
    );
    const data = await res.json();
    
    if (!data.length) {
      // Fallback: try without country restriction
      const fallbackParams = new URLSearchParams({
        format: 'json',
        q: query,
        limit: 1
      });
      
      const fallbackRes = await fetch(
        `https://nominatim.openstreetmap.org/search?${fallbackParams.toString()}`
      );
      const fallbackData = await fallbackRes.json();
      
      if (!fallbackData.length) return null;
      
      return {
        name: fallbackData[0].display_name,
        lat: parseFloat(fallbackData[0].lat),
        lng: parseFloat(fallbackData[0].lon)
      };
    }
    
    return {
      name: data[0].display_name,
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (err) {
    console.error('Geocoding error:', err);
    return null;
  }
}

export async function genRoute(fromCoords, toCoords) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lng},${fromCoords.lat};${toCoords.lng},${toCoords.lat}?overview=full&steps=true&geometries=geojson`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data.routes || !data.routes[0]) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]); // Convert to [lat, lng]
    
    return {
      coords,
      distance: route.distance / 1000, // km
      duration: route.duration, // seconds
      steps: route.legs[0].steps
    };
  } catch (err) {
    console.error('Route generation error:', err);
    throw err;
  }
}

export function safeMeta(distance, duration, score) {
  return {
    distance,
    duration,
    score,
    safetyLevel: score >= 80 ? 'Safe' : score >= 65 ? 'Moderate' : 'Risky'
  };
}
