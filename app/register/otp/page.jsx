'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../Register.module.css';
import Navbar from '../../components/Navbar';

export default function OTPPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles['bg-blur']} />
        <div className={styles.container}>
          <h1 className={styles.title}>Verify OTP</h1>
          {/* Wrap the part that uses useSearchParams in Suspense */}
          <Suspense fallback={<p className={styles.subtitle}>Loading...</p>}>
            <OTPForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}

function OTPForm() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read name & email from query params
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, otp, password }),
      });

      // Handle HTTP errors explicitly
      if (!res.ok) {
        let serverMsg = 'Verification failed';
        try {
          const json = await res.json();
          if (json?.error) serverMsg = json.error;
        } catch {}
        setMessage(serverMsg);
        return;
      }

      setMessage('Account created successfully!');
      router.push('/login');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(msg);
    }
  };

  return (
    <>
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
    </>
  );
}
