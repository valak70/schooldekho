'use client';

import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();

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
        <button onClick={() => router.push('/addSchool')}>Add School</button>
      </div>
    </nav>
  );
}
