import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from './firebase';
import { auth } from './firebase';
import LoginPage from './components/LoginPage';
import MapPage from './components/MapPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setCurrentPage('map');
      } else {
        setCurrentPage('login');
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      {currentPage === 'login' && (
        <LoginPage onPageChange={setCurrentPage} />
      )}

      {currentPage === 'map' && (
        <MapPage user={user} onLogout={() => {
          setCurrentPage('login');
        }} />
      )}
    </div>
  );
}

export default App;
