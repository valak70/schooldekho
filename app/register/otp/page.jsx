'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../Register.module.css';
import Navbar from '../../components/Navbar';

export default function OTPPage() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use useEffect to safely read query params at runtime
  useEffect(() => {
    const n = searchParams.get('name');
    const e = searchParams.get('email');

    if (!n || !e) {
      setMessage('Invalid access. Name or email missing.');
      return;
    }

    setName(n);
    setEmail(e);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, otp, password }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setMessage(result.error || 'Verification failed');
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  // If name/email not set yet, render a loading placeholder
  if (!name || !email) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={styles['bg-blur']} />
          <div className={styles.container}>
            <h1 className={styles.title}>Verify OTP</h1>
            {message ? <p className={styles.message}>{message}</p> : <p>Loading...</p>}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles['bg-blur']} />
        <div className={styles.container}>
          <h1 className={styles.title}>Verify OTP</h1>
          <p className={styles.subtitle}>
            Enter the OTP sent to <strong>{email}</strong> (check spam folder if not found)
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Verify & Register</button>
          </form>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      </main>
    </>
  );
}
