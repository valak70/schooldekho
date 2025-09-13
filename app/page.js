'use client';

import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <h1 className={styles.title}>Find quality schools near you with SchoolDekho</h1>
        <button
          className={styles.exploreButton}
          onClick={() => router.push('/showSchools')}
          aria-label="Explore Schools"
        >
          Explore Schools
        </button>

        {/* <button
          className={styles.addButton}
          onClick={() => router.push('/addSchool')}
          aria-label="Add School"
        >
          +
        </button> */}
      </main>
    </>
  );
}
