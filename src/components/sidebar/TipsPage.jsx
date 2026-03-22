import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import '../../styles/SubPages.css';

function TipsPage() {
  const { setCurrentPage } = useContext(AppContext);

  const tips = [
    {
      title: '🚶 When Walking',
      items: [
        'Stay aware of your surroundings',
        'Trust your instincts - if something feels wrong, it probably is',
        'Walk confidently with purpose',
        'Avoid using your phone while walking',
        'Keep valuables out of sight',
        'Vary your routes and timings'
      ]
    },
    {
      title: '🚗 Using Public Transport',
      items: [
        'Choose women-only compartments when available',
        'Sit near the door for quick exit',
        'Keep your bag close to you',
        'Avoid empty coaches/buses',
        'Note down bus/taxi registration numbers',
        'Tell someone when you board and alight'
      ]
    },
    {
      title: '🏙️ In Urban Areas',
      items: [
        'Use well-lit routes',
        'Stay on busy streets',
        'Avoid shortcuts through isolated areas',
        'Keep pepper spray accessible',
        'Share your location with trusted contacts',
        'Carry a whistle for emergencies'
      ]
    },
    {
      title: '🌙 Night Travel',
      items: [
        'Never travel alone if possible',
        'Inform someone about your schedule',
        'Ensure your phone is charged',
        'Use trusted transportation services',
        'Verify driver details before boarding',
        'Keep emergency contacts ready'
      ]
    }
  ];

  return (
    <div className="sub-page on">
      <div className="sub-header">
        <button className="back-btn" onClick={() => setCurrentPage('map')}>←</button>
        <h2>Safety Tips</h2>
      </div>

      <div className="sub-body">
        <div className="tips-container">
          {tips.map((section, idx) => (
            <div key={idx} className="tip-section">
              <h3>{section.title}</h3>
              <ul className="tip-list">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <span className="bullet">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="info-card">
          <h3>💪 Remember</h3>
          <p>Your safety is your priority. Always trust your instincts and don't hesitate to reach out for help. Safe Router is here to support your journeys.</p>
        </div>
      </div>
    </div>
  );
}

export default TipsPage;
