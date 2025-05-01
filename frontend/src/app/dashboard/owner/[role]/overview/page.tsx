'use client';

import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const MainDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
      router.replace('/login'); // After logout, go to login
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  };

  if (!user) return null; // Avoid rendering if user not available

  return (
    <div style={{ padding: '2rem' }}>
      <h1>
        Welcome to the {user.roleType} <strong>{user.roles[0]}</strong>{' '}
        Dashboard
      </h1>
      <p>
        This is the overview dashboard for <strong>{user.username}</strong>.
      </p>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '8px',
          backgroundColor: loggingOut ? '#ccc' : '#e53935',
          color: 'white',
          border: 'none',
          cursor: loggingOut ? 'not-allowed' : 'pointer',
        }}
      >
        {loggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default MainDashboard;
