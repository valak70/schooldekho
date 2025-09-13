'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Check login state on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    router.push('/');
  };

  const handleAddSchool = () => {
    if (!user) {
      alert('You need to be logged in to add a school!');
      return;
    }
    router.push('/addSchool');
  };

  return (
    <nav className={styles.navbar}>
      <img
        src="/logoSchool.png"
        alt="Logo"
        className={styles.logo}
        onClick={() => router.push('/')}
      />

      <div className={styles.navButtons}>
        <button onClick={() => router.push('/showSchools')}>Show Schools</button>
        <button onClick={handleAddSchool}>Add School</button>

        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => router.push('/register')}>Register/Login</button>
        )}
      </div>
    </nav>
  );
}
