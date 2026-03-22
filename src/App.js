import React, { useState, useEffect, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { useSession } from './hooks/useSession';
import { fbRefresh } from './firebase/auth';
import { fsGet } from './firebase/firestore';

// Auth Pages
import LoginPage from './components/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import OnboardPage from './pages/OnboardPage';

// Map Page
import MapPage from './pages/MapPage';

// Sidebar Sub-Pages
import ProfilePage from './components/sidebar/ProfilePage';
import HistoryPage from './components/sidebar/HistoryPage';
import EmergencyPage from './components/sidebar/EmergencyPage';
import TipsPage from './components/sidebar/TipsPage';
import DefensePage from './components/sidebar/DefensePage';
import ResourcesPage from './components/sidebar/ResourcesPage';
import SettingsPage from './components/sidebar/SettingsPage';

// Common Components
import Toast from './components/Toast';
import Loading from './components/Loading';
import './App.css';

function AppContent() {
  const SS = useSession();
  const { currentPage, setCurrentPage } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    async function checkSession() {
      if (SS.ok) {
        try {
          // Try to refresh token
          const newTokenData = await fbRefresh(SS.ref);
          const idToken = newTokenData.access_token;

          // Update localStorage with new token
          SS.set(idToken, SS.ref, SS.uid, SS.mail);

          // Try to get user profile
          let profile = null;
          try {
            profile = await fsGet(`users/${SS.uid}`, idToken);
          } catch (profileErr) {
            console.warn('Profile fetch failed:', profileErr);
            // Continue without profile
          }

          if (profile?.onboarded) {
            setCurrentPage('map');
          } else {
            setCurrentPage('onboard');
          }
        } catch (err) {
          console.error('Session check failed:', err);
          SS.clear();
          setCurrentPage('login');
        }
      } else {
        setCurrentPage('login');
      }
      setLoading(false);
    }

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app">
      <div className="orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      {/* Auth Pages (full screen) */}
      {currentPage === 'login' && (
        <LoginPage onPageChange={setCurrentPage} />
      )}

      {currentPage === 'register' && (
        <RegisterPage onPageChange={setCurrentPage} />
      )}

      {currentPage === 'verify' && (
        <VerifyPage onPageChange={setCurrentPage} />
      )}

      {currentPage === 'onboard' && (
        <OnboardPage onPageChange={setCurrentPage} />
      )}

      {/* Main Map Page - always show if authenticated */}
      {(currentPage === 'map' || currentPage === null || ['profile', 'history', 'emergency', 'tips', 'defense', 'resources', 'settings'].includes(currentPage)) && (
        <MapPage onLogout={() => setCurrentPage('login')} />
      )}

      {/* Sidebar Sub-Pages - overlay on top of map */}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'history' && <HistoryPage />}
      {currentPage === 'emergency' && <EmergencyPage />}
      {currentPage === 'tips' && <TipsPage />}
      {currentPage === 'defense' && <DefensePage />}
      {currentPage === 'resources' && <ResourcesPage />}
      {currentPage === 'settings' && <SettingsPage />}

      <Toast />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
