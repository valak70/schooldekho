'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';
import Navbar from '../components/Navbar';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    const result = await res.json();

    if (res.ok) {
      setMessage('OTP sent to your email');
      router.push(`/register/otp?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
    } else {
      setMessage(result.error || 'Registration failed');
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles['bg-blur']} />
        <div className={styles.container}>
          <h1 className={styles.title}>Register</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">Send OTP</button>
          </form>
          <p>
            Already have an account?{' '}
            <span
              className={styles.loginLink}
              onClick={() => router.push('/login')}
            >
              Login
            </span>
          </p>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      </main>
    </>
  );
}
