/**
 * History management - localStorage + Firestore sync
 */

export function saveHist(routes) {
  try {
    localStorage.setItem('sr_hist', JSON.stringify(routes));
  } catch (err) {
    console.error('Failed to save history:', err);
  }
}

export function getHist() {
  try {
    const stored = localStorage.getItem('sr_hist');
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Failed to get history:', err);
    return [];
  }
}

/**
 * Merge local and cloud history
 * Deduplicates by route signature and keeps latest
 */
export function mergeHistory(localRoutes, cloudRoutes) {
  const allRoutes = [...(localRoutes || []), ...(cloudRoutes || [])];
  const uniqueRoutes = {};

  allRoutes.forEach(route => {
    // Create signature from origin + destination
    const sig = `${route.from}|${route.to}`;
    if (!uniqueRoutes[sig] || new Date(route.time) > new Date(uniqueRoutes[sig].time)) {
      uniqueRoutes[sig] = route;
    }
  });

  return Object.values(uniqueRoutes)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 50); // Keep latest 50
}

export function addToHist(route, uid, fsAdd, idToken) {
  try {
    // Add to local
    const local = getHist();
    local.unshift(route);
    saveHist(local.slice(0, 50));
    console.log('✅ Route saved to localStorage. Total routes:', local.length);

    // Add to Firestore
    if (uid && fsAdd && idToken) {
      fsAdd(`users/${uid}/history`, route, idToken).catch(err => {
        console.error('Failed to save to Firestore:', err);
      });
    }
  } catch (err) {
    console.error('Failed to add to history:', err);
  }
}
