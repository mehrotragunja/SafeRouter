import React from 'react';

function Loading() {
  return (
    <div className="loading">
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌸</div>
      <div style={{ fontFamily: 'var(--fd)', fontSize: '28px', fontWeight: '700', color: 'var(--text)', marginBottom: '10px' }}>
        Safe Router
      </div>
      <div style={{ fontSize: '14px', color: 'var(--muted)', letterSpacing: '0.1em' }}>
        Loading...
      </div>
    </div>
  );
}

export default Loading;
