import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useGPS } from '../../hooks/useGPS';
import '../../styles/MapPage.css';

function SOSButton({ contact, location }) {
  const { showToast } = useContext(AppContext);
  const { getCurrentPosition } = useGPS();

  const handleSOS = () => {
    if (!contact) {
      showToast('Set emergency contact in profile first', 'error');
      return;
    }

    if (location) {
      sendSOS(contact, location);
    } else {
      getCurrentPosition((pos) => {
        sendSOS(contact, pos);
      });
    }
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
    <button 
      className="sos-fab pulse" 
      onClick={handleSOS} 
      title="Send SOS alert"
    >
      <span className="sos-text">SOS</span>
      <span className="sos-sub">Help</span>
    </button>
  );
}

export default SOSButton;
