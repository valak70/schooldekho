'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../Register.module.css';
import Navbar from '../../components/Navbar';

export default function OTPPage() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get name & email from query params
  const name = searchParams.get('name');
  const email = searchParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, otp, password }),
    });

    const result = await res.json();

    if (res.ok) {
      setMessage('Account created successfully!');
      router.push('/login'); // redirect to login page
    } else {
      setMessage(result.error || 'Verification failed');
    }
  };

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
