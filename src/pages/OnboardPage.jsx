import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useSession } from '../hooks/useSession';
import { fsPatch } from '../firebase/firestore';
import '../styles/AuthPages.css';

function OnboardPage({ onPageChange }) {
  const { showToast } = useContext(AppContext);
  const SS = useSession();
  
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [contact1, setContact1] = useState('+91 ');
  const [contact2, setContact2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = async () => {
    if (!age) {
      showToast('Please select your age group', 'error');
      return;
    }

    if (!contact1.replace(/\D/g, '').length) {
      showToast('Please enter a valid emergency contact', 'error');
      return;
    }

    setLoading(true);
    try {
      await fsPatch(`users/${SS.uid}`, {
        age,
        contact1: contact1.replace(/\s/g, ''),
        contact2: contact2.replace(/\s/g, ''),
        onboarded: true
      }, SS.tok);
      
      showToast('Profile saved! Welcome to Safe Router 🌸', 'success');
      onPageChange('map');
    } catch (err) {
      showToast(err.message || 'Failed to save profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onPageChange('map');
  };

  return (
    <div className="page active">
      <div className="onboard-card glass">
        <div className="auth-header">
          <h2>Complete Your Profile</h2>
          <p>Help us personalize your experience</p>
        </div>

        {/* Step indicators */}
        <div className="step-dots">
          <div className={`sdot ${step >= 1 ? 'on' : ''}`}></div>
          <div className={`sdot ${step >= 2 ? 'on' : ''}`}></div>
          <div className={`sdot ${step >= 3 ? 'on' : ''}`}></div>
        </div>

        {/* Step 1: Age */}
        {step === 1 && (
          <div className="ob-step on">
            <p className="step-question">How old are you?</p>
            <select 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              className="field-select"
            >
              <option value="">Select age group</option>
              <option value="13-17">13-17 years</option>
              <option value="18-25">18-25 years</option>
              <option value="26-35">26-35 years</option>
              <option value="36-50">36-50 years</option>
              <option value="50+">50+ years</option>
            </select>
          </div>
        )}

        {/* Step 2: Primary Contact */}
        {step === 2 && (
          <div className="ob-step on">
            <p className="step-question">Emergency Contact 1</p>
            <p className="step-hint">This will be used for SOS alerts</p>
            <div className="field">
              <div className="inp-wrap">
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={contact1}
                  onChange={(e) => setContact1(e.target.value)}
                  required
                />
                <span className="ico">📞</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Secondary Contact */}
        {step === 3 && (
          <div className="ob-step on">
            <p className="step-question">Emergency Contact 2</p>
            <p className="step-hint">(Optional) Another trusted contact</p>
            <div className="field">
              <div className="inp-wrap">
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={contact2}
                  onChange={(e) => setContact2(e.target.value)}
                />
                <span className="ico">📱</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="ob-buttons">
          {step > 1 && (
            <button 
              className="btn btn-ghost" 
              onClick={handleBack}
              disabled={loading}
            >
              ← Back
            </button>
          )}
          
          {step < 3 ? (
            <button 
              className="btn btn-rose" 
              onClick={handleNext}
              disabled={loading}
            >
              Next →
            </button>
          ) : (
            <button 
              className="btn btn-rose" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          )}
        </div>

        <button 
          className="skip-btn" 
          onClick={handleSkip} 
          disabled={loading}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

export default OnboardPage;
