import React, { useState, useContext } from 'react';
import { fbSignUp, fbSendVerification } from '../firebase/auth';
import { fsSet } from '../firebase/firestore';
import { useSession } from '../hooks/useSession';
import { AppContext } from '../context/AppContext';
import '../styles/AuthPages.css';

function RegisterPage({ onPageChange }) {
  const { showToast } = useContext(AppContext);
  const SS = useSession();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Sign up with Firebase
      const authData = await fbSignUp(formData.email, formData.password);

      // Create user profile in Firestore
      await fsSet(`users/${authData.localId}`, {
        email: formData.email,
        onboarded: false,
        age: '',
        contact1: '',
        contact2: '',
        settings: {
          autoSOS: false,
          voice: false,
          dark: false
        }
      }, authData.idToken);

      // Send verification email
      await fbSendVerification(authData.idToken);

      // Save session
      SS.set(authData.idToken, authData.refreshToken, authData.localId, formData.email);

      showToast('Registration successful! Check your email for verification code.', 'success');
      onPageChange('verify');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <div className="auth-card glass">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join Safe Router 🌸</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="field">
            <label>Email</label>
            <div className="inp-wrap">
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <span className="ico">📧</span>
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="inp-wrap">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <span className="ico">🔒</span>
            </div>
          </div>

          <div className="field">
            <label>Confirm Password</label>
            <div className="inp-wrap">
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <span className="ico">✓</span>
            </div>
          </div>

          {error && <div className="err show">{error}</div>}

          <button type="submit" className="btn btn-rose" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-toggle">
          Already have an account?{' '}
          <span className="link" onClick={() => onPageChange('login')}>
            Sign in here
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
