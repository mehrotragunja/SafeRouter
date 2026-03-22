import React, { useState, useContext } from 'react';
import { fbVerifyEmail } from '../firebase/auth';
import { useSession } from '../hooks/useSession';
import { AppContext } from '../context/AppContext';
import '../styles/AuthPages.css';

function VerifyPage({ onPageChange }) {
  const { showToast } = useContext(AppContext);
  const SS = useSession();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter verification code');
      return;
    }

    setLoading(true);
    try {
      await fbVerifyEmail(SS.tok, code);
      showToast('Email verified! Proceeding to profile setup...', 'success');
      onPageChange('onboard');
    } catch (err) {
      setError(err.message || 'Verification failed. Check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <div className="auth-card glass">
        <div className="auth-header">
          <h2>Verify Email</h2>
          <p>Check your inbox for verification code</p>
        </div>

        <form onSubmit={handleVerify} className="auth-form">
          <div className="field">
            <label>Verification Code</label>
            <div className="inp-wrap">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength="6"
                required
                disabled={loading}
              />
              <span className="ico">✉️</span>
            </div>
          </div>

          <p className="verify-hint">
            If you don't see the email, check your spam folder or request a new code.
          </p>

          {error && <div className="err show">{error}</div>}

          <button type="submit" className="btn btn-rose" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <button
          className="btn btn-ghost"
          onClick={() => onPageChange('login')}
          disabled={loading}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default VerifyPage;
