import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { fbSignIn, fbErr } from '../firebase/auth';
import { fsGet } from '../firebase/firestore';
import { useSession } from '../hooks/useSession';
import './LoginPage.css';

function LoginPage({ onPageChange }) {
  const { setUser, setProfile, showToast } = useContext(AppContext);
  const SS = useSession();

  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authData = await fbSignIn(email, password);
      const profile = await fsGet(`users/${authData.localId}`, authData.idToken);

      SS.set(authData.idToken, authData.refreshToken, authData.localId, email);

      setUser({
        uid: authData.localId,
        email,
        idToken: authData.idToken,
        refreshToken: authData.refreshToken
      });
      setProfile(profile);

      showToast('Login successful!', 'success');
      onPageChange(profile?.onboarded ? 'map' : 'onboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement signup flow
      showToast('Use login for now', 'info');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <div className="login-card glass">
        {/* Left art panel */}
        <div className="login-art">
          <div className="art-inner">
            <div className="art-logo">Safe Router</div>
            <div className="art-tag">Navigate with Confidence</div>
            <span className="art-emoji">🌸</span>
            <div className="art-features">
              <div className="art-feat">📍 GPS Navigation</div>
              <div className="art-feat">🆘 SOS Alert</div>
              <div className="art-feat">🗺️ Safe Routes</div>
              <div className="art-feat">🚨 Emergency Contact</div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="login-form">
          {!showRegister ? (
            <>
              <h2>Welcome Back</h2>
              <p>Sign in to your Safe Router account</p>

              <form onSubmit={handleLogin}>
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
                    <span className="ico">🔐</span>
                  </div>
                </div>

                {error && <div className="err show">{error}</div>}

                <button type="submit" className="btn btn-rose" disabled={loading}>
                  {loading ? 'Signing in...' : '→ Sign In'}
                </button>
              </form>

              <div className="divider">or</div>

              <button
                className="btn btn-white"
                onClick={() => setShowRegister(true)}
                disabled={loading}
              >
                Create New Account
              </button>
            </>
          ) : (
            <>
              <h2>Create Account</h2>
              <p>Join Safe Router to navigate safely</p>

              <form onSubmit={handleRegister}>
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
                    <span className="ico">🔐</span>
                  </div>
                </div>

                <div className="field">
                  <label>Confirm Password</label>
                  <div className="inp-wrap">
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <span className="ico">✓</span>
                  </div>
                </div>

                {error && <div className="err show">{error}</div>}

                <button type="submit" className="btn btn-rose" disabled={loading}>
                  {loading ? 'Creating account...' : '→ Create Account'}
                </button>
              </form>

              <div className="divider">already registered?</div>

              <button
                className="btn btn-white"
                onClick={() => setShowRegister(false)}
                disabled={loading}
              >
                Sign In Instead
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
