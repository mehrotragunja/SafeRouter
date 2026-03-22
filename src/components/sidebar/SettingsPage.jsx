import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useSession } from '../../hooks/useSession';
import { fsPatch } from '../../firebase/firestore';
import '../../styles/SubPages.css';

function SettingsPage() {
  const { setCurrentPage, profile, showToast } = useContext(AppContext);
  const SS = useSession();

  const [settings, setSettings] = useState(profile?.settings || {
    autoSOS: false,
    voice: false,
    dark: false
  });
  const [saving, setSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fsPatch(`users/${SS.uid}`, { settings }, SS.tok);
      showToast('Settings saved successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sub-page on">
      <div className="sub-header">
        <button className="back-btn" onClick={() => setCurrentPage('map')}>←</button>
        <h2>Settings</h2>
      </div>

      <div className="sub-body">
        <div className="settings-container">
          {/* Safety Settings */}
          <div className="settings-section">
            <h3>🛡️ Safety Settings</h3>

            <div className="setting-item">
              <div className="setting-info">
                <p className="setting-label">Auto SOS</p>
                <p className="setting-desc">Automatically send SOS when emergency detected</p>
              </div>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="autoSOS"
                  checked={settings.autoSOS}
                  onChange={() => handleToggle('autoSOS')}
                />
                <label htmlFor="autoSOS"></label>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <p className="setting-label">Voice Alerts</p>
                <p className="setting-desc">Get voice notifications during navigation</p>
              </div>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="voice"
                  checked={settings.voice}
                  onChange={() => handleToggle('voice')}
                />
                <label htmlFor="voice"></label>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="settings-section">
            <h3>🎨 Display Settings</h3>

            <div className="setting-item">
              <div className="setting-info">
                <p className="setting-label">Dark Mode</p>
                <p className="setting-desc">Easier on the eyes at night</p>
              </div>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="dark"
                  checked={settings.dark}
                  onChange={() => handleToggle('dark')}
                />
                <label htmlFor="dark"></label>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="settings-section">
            <h3>ℹ️ About</h3>
            <div className="about-info">
              <p><strong>App Version:</strong> 1.0.0</p>
              <p><strong>Built with:</strong> React + Firebase + Leaflet</p>
              <p><strong>For:</strong> Women Safety & Navigation</p>
            </div>
          </div>

          {/* Privacy */}
          <div className="settings-section">
            <h3>🔒 Privacy & Security</h3>
            <p className="privacy-text">
              Your data is encrypted end-to-end. We never share your location or personal information with third parties. Your emergency contacts are only used when you explicitly send an SOS.
            </p>
          </div>
        </div>

        <div className="settings-actions">
          <button 
            className="btn btn-rose" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
          <button className="btn btn-ghost">
            📄 Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
