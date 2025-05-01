import Link from 'next/link';
import Preloading from '@/components/common/Preloading';

export default function NotFoundPage() {
  return (
    <>
      <Preloading text="Synix Solutions" />
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
        <h1
          style={{ fontSize: '5rem', marginBottom: '1rem', color: '#e53935' }}
        >
          404
        </h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        <p style={{ marginBottom: '2rem' }}>
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1976d2',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
          }}
        >
          Home
        </Link>
      </div>
    </>
  );
}
