'use client';

import { useEffect, useState } from 'react';
import styles from './showSchools.module.css';
import Navbar from '../components/Navbar';
import { Martian_Mono } from 'next/font/google';

async function getSchools() {
  const res = await fetch('/api/schools');
  if (!res.ok) {
    throw new Error('Failed to fetch schools');
  }
  return res.json();
}

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSchools()
      .then(data => {
        setSchools(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading schools...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <Navbar />
    <main className={styles.main}>
      <div className={styles['bg-blur']} />
      <div className={styles.container}>
      <h1 className={styles.title}>Discover Our Campuses</h1>
      <div className={styles.grid}>
        {schools.map(school => (
          <div key={school.id} className={styles.card}>
            <img src={school.image} alt={`Image of ${school.name}`} className={styles.image} />
            <div className={styles.info}>
              <h3>{school.name}</h3>
              <p>{school.address}</p>
              <span>{school.city}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
</main>
    </>
  );
}
