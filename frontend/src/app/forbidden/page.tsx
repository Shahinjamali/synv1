'use client';

import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '5rem', marginBottom: '1rem', color: '#e53935' }}>
        403
      </h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Access Denied</h2>
      <p style={{ marginBottom: '2rem' }}>
        You dont have permission to view this page.
      </p>
      <Link
        href="/dashboard"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#1976d2',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
        }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
