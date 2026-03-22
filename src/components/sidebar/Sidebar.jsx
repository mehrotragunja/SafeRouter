import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useSession } from '../../hooks/useSession';
import '../../styles/Sidebar.css';

function Sidebar({ onClose, onLogout }) {
  const { setCurrentPage } = useContext(AppContext);
  const SS = useSession();

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'history', label: 'Route History', icon: '📍' },
    { id: 'emergency', label: 'Emergency Numbers', icon: '🚨' },
    { id: 'tips', label: 'Safety Tips', icon: '💡' },
    { id: 'defense', label: 'Self-Defense', icon: '🥋' },
    { id: 'resources', label: 'Resources & NGOs', icon: '🤝' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    SS.clear();
    onLogout?.();
    onClose();
  };

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar glass" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sidebar-header">
          <h2>Safe Router 🌸</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="menu-item"
              onClick={() => {
                setCurrentPage(item.id);
                onClose();
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow">›</span>
            </button>
          ))}
        </nav>

        {/* Logout button */}
        <div className="sidebar-footer">
          <button className="btn btn-ghost" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
