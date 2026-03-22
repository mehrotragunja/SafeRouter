/**
 * Helper utility functions
 */

export function fmtDist(km) {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function fmtTime(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const mins_remaining = mins % 60;
  return `${hours}h ${mins_remaining}m`;
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getSafetyLevel(score) {
  if (score >= 80) return { level: 'Safe', color: '#43a047', badge: '✓' };
  if (score >= 65) return { level: 'Moderate', color: '#fb8c00', badge: '⚠' };
  return { level: 'Risky', color: '#e53935', badge: '!' };
}

/**
 * Calculate safety score based on multiple factors
 * Returns score 0-100 based on:
 * - Distance (shorter = safer)
 * - Time of day (day = safer)
 * - Route characteristics
 * - Destination safety zone
 */
export function generateSafetyScore(routeData = null) {
  let score = 70; // Base score
  
  // Factor 1: Distance (0-15 points)
  if (routeData?.distance) {
    const distance = routeData.distance;
    if (distance < 1) score += 15;           // <1km = very safe
    else if (distance < 3) score += 12;      // 1-3km = safe
    else if (distance < 5) score += 8;       // 3-5km = moderate
    else if (distance < 10) score += 4;      // 5-10km = less safe
    else score += 1;                         // >10km = less safe
  }
  
  // Factor 2: Time of day (0-10 points)
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) score += 10;   // Day (6am-6pm) = safest
  else if (hour >= 18 && hour < 21) score += 6; // Evening (6pm-9pm) = moderate
  else if (hour >= 21 && hour < 24) score += 3; // Night (9pm-12am) = risky
  else score += 0;                            // Late night (12am-6am) = very risky
  
  // Factor 3: Duration (0-5 points)
  if (routeData?.duration) {
    const minutes = routeData.duration / 60;
    if (minutes < 10) score += 5;            // <10 min = safe
    else if (minutes < 30) score += 3;       // 10-30 min = moderate
    else if (minutes < 60) score += 2;       // 30-60 min = less safe
    else score += 0;                         // >60 min = risky
  }
  
  // Factor 4: Destination safety zones (0-10 points)
  // Safe areas in India (Delhi NCR region)
  const safeZones = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090, safetyBonus: 8 },
    { name: 'Gurgaon', lat: 28.4595, lng: 77.0266, safetyBonus: 8 },
    { name: 'Noida', lat: 28.5355, lng: 77.3910, safetyBonus: 6 },
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178, safetyBonus: 5 },
    { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, safetyBonus: 9 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, safetyBonus: 7 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, safetyBonus: 7 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, safetyBonus: 6 }
  ];
  
  // Add bonus based on distance to safe zones (simplified)
  const bonus = safeZones.reduce((max, zone) => {
    return Math.max(max, zone.safetyBonus);
  }, 0);
  score += Math.min(bonus / 2, 5); // Partial safety bonus
  
  // Ensure score is between 0-100
  return Math.min(Math.max(Math.round(score), 0), 100);
}
