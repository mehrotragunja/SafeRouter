import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { fbSignIn } from '../firebase/auth';
import { fsGet } from '../firebase/firestore';
import { useSession } from '../hooks/useSession';
import './LoginPage.css';

function LoginPage({ onPageChange }) {
  const { showToast } = useContext(AppContext);
  const SS = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // Sign in with Firebase REST API
      const authData = await fbSignIn(email, password);

      // Save session first
      SS.set(authData.idToken, authData.refreshToken, authData.localId, email);

      // Try to get user profile, but don't fail if it doesn't exist
      let profile = null;
      try {
        profile = await fsGet(`users/${authData.localId}`, authData.idToken);
      } catch (profileErr) {
        console.warn('Profile fetch failed, user may not be onboarded:', profileErr);
        // Continue without profile - user will be onboarded
      }

      showToast('Login successful!', 'success');

      // Route based on onboarding status
      if (profile?.onboarded) {
        onPageChange('map');
      } else {
        onPageChange('onboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <div className="auth-card glass">
        <div className="login-left">
          <div className="login-content">
            <h1 className="logo-text">Safe Router 🌸</h1>
            <p className="logo-subtitle">Women Safety Navigation</p>
          </div>
        </div>

        <div className="login-right">
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>

            <div className="field">
              <label>Email</label>
              <div className="inp-wrap">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <span className="ico">🔒</span>
              </div>
            </div>

            {error && <div className="err show">{error}</div>}

            <button type="submit" className="btn btn-rose" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-toggle">
            Don't have an account?{' '}
            <span 
              className="link" 
              onClick={() => onPageChange('register')}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;