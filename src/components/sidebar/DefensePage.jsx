import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import '../../styles/SubPages.css';

function DefensePage() {
  const { setCurrentPage } = useContext(AppContext);

  const techniques = [
    {
      title: '🚪 If Trapped',
      items: [
        'Stay calm and assess the situation',
        'Look for exits (windows, doors)',
        'Make noise to attract attention',
        'Use any nearby object as defense',
        'Shout for help loudly',
        'Try to escape to a crowded place'
      ]
    },
    {
      title: '👋 Basic Self-Defense Moves',
      items: [
        '💥 Palm Strike: Push palm upward against chin/nose',
        '👣 Knee Strike: Drive knee upward to groin area',
        '👂 Ear Slap: Sharp slaps to ears can disorient',
        '👣 Foot Stomp: Step hard on instep',
        '💪 Elbow Strike: Backward elbow jab to face/chest',
        '🎯 Eye Gouge: As last resort, protect eyes'
      ]
    },
    {
      title: '🔫 Using Tools',
      items: [
        'Carry a personal alarm or whistle',
        'Pepper spray (if legal in your area)',
        'Self-defense keychain tools',
        'Keep phone accessible for calling help',
        'Tactical pen for self-defense',
        'Know how to use any tool you carry'
      ]
    },
    {
      title: '⚡ During an Attack',
      items: [
        'Aim for vulnerable spots: eyes, nose, throat',
        'Make it uncomfortable for the attacker',
        'Be aggressive and loud',
        'Create distance and run to safety',
        'Head towards crowded areas',
        'Call emergency services immediately'
      ]
    }
  ];

  return (
    <div className="sub-page on">
      <div className="sub-header">
        <button className="back-btn" onClick={() => setCurrentPage('map')}>←</button>
        <h2>Self-Defense</h2>
      </div>

      <div className="sub-body">
        <div className="defense-container">
          {techniques.map((section, idx) => (
            <div key={idx} className="defense-section">
              <h3>{section.title}</h3>
              <ul className="defense-list">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="info-card warning">
          <h3>⚠️ Important Disclaimer</h3>
          <p>These are general safety guidelines. Always prioritize your safety and escape over confrontation. In any emergency, contact local authorities immediately. Consider taking professional self-defense classes.</p>
        </div>
      </div>
    </div>
  );
}

export default DefensePage;
