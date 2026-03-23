import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useGPS } from '../../hooks/useGPS';
import '../../styles/MapPage.css';

function SOSButton({ contact, location }) {
  const { showToast } = useContext(AppContext);
  const { getCurrentPosition } = useGPS();
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  const handleSOS = () => {
    // If contact is set, use it directly
    if (contact && contact.trim()) {
      if (location) {
        sendSOS(contact, location);
      } else {
        getCurrentPosition((pos) => {
          sendSOS(contact, pos);
        });
      }
    } else {
      // No contact saved - ask user to provide phone number
      setShowPhonePrompt(true);
      setPhoneInput('');
    }
  };

  const handlePhoneSubmit = () => {
    const cleanPhone = phoneInput.replace(/\D/g, '');
    
    if (!cleanPhone || cleanPhone.length < 10) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }

    setShowPhonePrompt(false);
    
    if (location) {
      sendSOS(cleanPhone, location);
    } else {
      getCurrentPosition((pos) => {
        sendSOS(cleanPhone, pos);
      });
    }
  };

  const handlePhoneCancel = () => {
    setShowPhonePrompt(false);
    setPhoneInput('');
  };

  const sendSOS = (phoneNumber, loc) => {
    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (!cleanPhone) {
      showToast('Invalid emergency contact', 'error');
      return;
    }

    const message = `🆘 EMERGENCY! I need help! Location: https://maps.google.com/?q=${loc.lat},${loc.lng}`;
    const encodedMsg = encodeURIComponent(message);
    
    // WhatsApp Web Intent
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    
    window.open(waUrl, '_blank');
    showToast('Opening WhatsApp...', 'info');
  };

  return (
    <>
      {showPhonePrompt && (
        <div className="sos-modal-overlay" onClick={handlePhoneCancel}>
          <div className="sos-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Emergency Contact</h3>
            <p>Enter the phone number to send your location via WhatsApp:</p>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePhoneSubmit()}
              autoFocus
              maxLength="20"
            />
            <div className="sos-modal-actions">
              <button onClick={handlePhoneSubmit} className="btn btn-rose" style={{ flex: 1 }}>
                Send Location
              </button>
              <button onClick={handlePhoneCancel} className="btn btn-ghost" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <button 
        className="sos-fab pulse" 
        onClick={handleSOS} 
        title="Send SOS alert"
      >
        <span className="sos-text">SOS</span>
        <span className="sos-sub">Help</span>
      </button>
    </>
  );
}

export default SOSButton;
