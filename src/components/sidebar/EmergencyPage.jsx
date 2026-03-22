import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import '../../styles/SubPages.css';

function EmergencyPage() {
  const { setCurrentPage } = useContext(AppContext);

  const emergencyNumbers = [
    { name: 'Police (India)', number: '100', description: 'Emergency police assistance' },
    { name: 'Women Helpline', number: '1090', description: 'Women safety and support' },
    { name: 'AASRA Suicide Prevention', number: '9820466726', description: 'Mental health support' },
    { name: 'iCall Helpline', number: '9152987821', description: 'Emotional support' },
    { name: 'RailTel Helpline', number: '182', description: 'Railway emergency' },
    { name: 'Ambulance', number: '102', description: 'Medical emergency' },
  ];

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleWhatsApp = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <div className="sub-page on">
      <div className="sub-header">
        <button className="back-btn" onClick={() => setCurrentPage('map')}>←</button>
        <h2>Emergency Numbers</h2>
      </div>

      <div className="sub-body">
        <div className="emergency-list">
          {emergencyNumbers.map((contact, idx) => (
            <div key={idx} className="emergency-card">
              <div className="emergency-info">
                <h3>{contact.name}</h3>
                <p className="emergency-num">{contact.number}</p>
                <p className="emergency-desc">{contact.description}</p>
              </div>

              <div className="emergency-actions">
                <button
                  className="btn btn-icon"
                  onClick={() => handleCall(contact.number)}
                  title="Call"
                >
                  ☎️
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => handleWhatsApp(contact.number)}
                  title="WhatsApp"
                >
                  💬
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="info-card">
          <h3>⚠️ Important</h3>
          <p>Save your emergency contacts in your device for quick access. These numbers are for India - check your local equivalents.</p>
        </div>
      </div>
    </div>
  );
}

export default EmergencyPage;
