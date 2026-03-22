import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useSession } from '../../hooks/useSession';
import '../../styles/SubPages.css';

function ProfilePage() {
  const { profile, setCurrentPage } = useContext(AppContext);
  const SS = useSession();

  return (
    <div className="sub-page on">
      <div className="sub-header">
        <button className="back-btn" onClick={() => setCurrentPage('map')}>←</button>
        <h2>Profile</h2>
      </div>

      <div className="sub-body">
        <div className="profile-section">
          <div className="profile-avatar">👤</div>
          
          <div className="profile-info">
            <div className="info-field">
              <label>Email</label>
              <p>{SS.mail}</p>
            </div>

            <div className="info-field">
              <label>Age Group</label>
              <p>{profile?.age || 'Not specified'}</p>
            </div>

            <div className="info-field">
              <label>Primary Emergency Contact</label>
              <p>{profile?.contact1 || 'Not set'}</p>
            </div>

            <div className="info-field">
              <label>Secondary Emergency Contact</label>
              <p>{profile?.contact2 || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>About Your Profile</h3>
          <p>Your profile information is encrypted and stored securely. Emergency contacts are only used when you send SOS alerts.</p>
        </div>

        <div className="profile-actions">
          <button className="btn btn-rose">
            ✏️ Edit Profile
          </button>
          <button className="btn btn-ghost">
            🔄 Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
