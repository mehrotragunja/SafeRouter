import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import '../../styles/SubPages.css';

function ResourcesPage() {
  const { setCurrentPage } = useContext(AppContext);

  const resources = [
    {
      name: 'National Commission for Women (NCW)',
      description: 'Protecting women rights and welfare in India',
      contact: 'ncwmail@ncw.nic.in',
      website: 'https://ncw.gov.in'
    },
    {
      name: 'Sakshi - Collective Against Gender Violence',
      description: 'Support and resource center for sexual violence survivors',
      contact: 'Delhi: 9868001099',
      website: 'https://www.sakshi.or.in'
    },
    {
      name: 'All India Women Helpline - AIWH',
      description: 'Counseling and support for women',
      contact: '1567 (toll-free)',
      website: 'https://www.aiwh.in'
    },
    {
      name: 'Lady Targeters',
      description: 'Fighting women-related crimes through community action',
      contact: 'info@ladytargeters.in',
      website: 'https://www.ladytargeters.in'
    },
    {
      name: 'Parivartan - A Center of Creative Change',
      description: 'Works against gender-based violence',
      contact: 'Delhi: 9278666444',
      website: 'https://parivartan.net.in'
    },
    {
      name: 'Aman Biradari',
      description: 'Community violence intervention in Delhi',
      contact: 'Delhi: 8800-11-5050',
      website: 'https://www.amanbiradari.org'
    },
    {
      name: 'Kshama - Women Cell',
      description: 'Crisis intervention for women in distress',
      contact: 'Bangalore: 080-2532-8005',
      website: 'https://www.kshama.org'
    },
    {
      name: 'CREA - Creating Resources for Empowerment in Action',
      description: 'Rights-based organization working for gender justice',
      contact: 'New Delhi: 011-4100-0604',
      website: 'https://www.creaworld.org'
    }
  ];

  const handleVisitWebsite = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="sub-page on">
      <div className="sub-header">
        <button className="back-btn" onClick={() => setCurrentPage('map')}>←</button>
        <h2>Resources & NGOs</h2>
      </div>

      <div className="sub-body">
        <div className="resources-list">
          {resources.map((org, idx) => (
            <div key={idx} className="resource-card">
              <h3>{org.name}</h3>
              <p className="resource-desc">{org.description}</p>
              
              <div className="resource-contact">
                <p><strong>📞</strong> {org.contact}</p>
              </div>

              <button
                className="btn btn-rose"
                onClick={() => handleVisitWebsite(org.website)}
                style={{ marginTop: '10px' }}
              >
                🌐 Visit Website
              </button>
            </div>
          ))}
        </div>

        <div className="info-card">
          <h3>🤝 Get Support</h3>
          <p>These organizations are dedicated to women's safety and empowerment. Don't hesitate to reach out if you need help or support. You're not alone.</p>
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;
