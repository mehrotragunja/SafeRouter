import React, { createContext, useState, useCallback } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(null); // { uid, email, idToken, refreshToken }
  const [profile, setProfile] = useState(null); // { uid, email, age, contact1, contact2, onboarded }

  // Map state
  const [currentLocation, setCurrentLocation] = useState(null); // { lat, lng }
  const [routeData, setRouteData] = useState(null); // { from, to, route, distance, time, score, level }
  const [isNavigating, setIsNavigating] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    autoSOS: false,
    voice: false,
    dark: false
  });

  // History
  const [history, setHistory] = useState([]); // Array of routes

  // UI
  const [toast, setToast] = useState(null); // { msg, type: 'success'|'error'|'info' }
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // Page navigation state

  // Actions
  const showToast = useCallback((msg, type = 'info', duration = 3000) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
    setRouteData(null);
    setIsNavigating(false);
    localStorage.removeItem('sr_tok');
    localStorage.removeItem('sr_ref');
    localStorage.removeItem('sr_uid');
    localStorage.removeItem('sr_mail');
  }, []);

  return (
    <AppContext.Provider value={{
      // Auth
      user,
      setUser,
      profile,
      setProfile,

      // Map
      currentLocation,
      setCurrentLocation,
      routeData,
      setRouteData,
      isNavigating,
      setIsNavigating,

      // Settings
      settings,
      setSettings,

      // History
      history,
      setHistory,

      // UI
      toast,
      showToast,
      loading,
      setLoading,
      sidebarOpen,
      setSidebarOpen,
      currentPage,
      setCurrentPage,

      // Actions
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
}
