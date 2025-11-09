import React from 'react';
import AuthButtons from '../auth/AuthButtons';

export default function Signup() {
  return (
    <div style={{ maxWidth: 420, margin: '64px auto', padding: 24 }}>
      <h1>Create your account</h1>
      <p style={{ color: '#6b7280' }}>Sign up with:</p>
      <AuthButtons mode="signup" />
    </div>
  );
}


