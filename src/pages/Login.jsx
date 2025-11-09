import React from 'react';
import AuthButtons from '../auth/AuthButtons';

export default function Login() {
  return (
    <div style={{ maxWidth: 420, margin: '64px auto', padding: 24 }}>
      <h1>Log in to Forty+Fit</h1>
      <p style={{ color: '#6b7280' }}>Choose a provider:</p>
      <AuthButtons mode="signin" />
    </div>
  );
}


