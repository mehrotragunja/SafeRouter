import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from '../firebase';
import { auth } from '../firebase';
import './LoginPage.css';

function LoginPage({ onPageChange }) {
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
      await signInWithEmailAndPassword(auth, email, password);
      onPageChange('map');
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setError('Registration successful! Please verify your email.');
      setShowRegister(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onPageChange('map');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="glass login-card">
        <div className="login-left">
          <div className="login-content">
            <h1 className="logo-text">Safe Router 🌸</h1>
            <p className="logo-subtitle">Women Safety Navigation</p>
          </div>
        </div>

        <div className="login-right">
          {!showRegister ? (
            <form onSubmit={handleLogin}>
              <h2>Welcome Back</h2>

              <div className="field">
                <label>Email</label>
                <div className="inp-wrap">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  />
                  <span className="ico">🔒</span>
                </div>
              </div>

              {error && <div className="err show">{error}</div>}

              <button type="submit" className="btn btn-rose" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                className="btn btn-google"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                🔵 Sign in with Google
              </button>

              <p className="toggle-text">
                Don't have an account?{' '}
                <span
                  className="link"
                  onClick={() => {
                    setShowRegister(true);
                    setError('');
                  }}
                >
                  Register here
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h2>Create Account</h2>

              <div className="field">
                <label>Email</label>
                <div className="inp-wrap">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  />
                  <span className="ico">🔒</span>
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
                  />
                  <span className="ico">✓</span>
                </div>
              </div>

              {error && <div className="err show">{error}</div>}

              <button type="submit" className="btn btn-rose" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="toggle-text">
                Already have an account?{' '}
                <span
                  className="link"
                  onClick={() => {
                    setShowRegister(false);
                    setError('');
                  }}
                >
                  Sign in here
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
