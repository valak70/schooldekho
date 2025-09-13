'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './addSchool.module.css';
import Navbar from '../components/Navbar';

export default function AddSchoolPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [message, setMessage] = useState('');


  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (res.status === 401) {
          if (!cancelled) router.push('/login');
          return;
        }
        if (!res.ok) {
          if (!cancelled) router.push('/login');
          return;
        }

      } catch {
        if (!cancelled) router.push('/login');
      }
    };

    checkAuth();
    return () => { cancelled = true; };
  }, [router]);

  const onSubmit = async (data) => {
    setMessage('');
    const formData = new FormData();

    // Append fields; ensure file uses the first element of FileList
    Object.keys(data).forEach((key) => {
      if (key === 'image') {
        const file = data.image?.[0];
        if (file) formData.append('image', file);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      // Fetch doesn't throw on HTTP errors; check .ok
      if (!response.ok) {
        let serverMsg = `Something went wrong (${response.status})`;
        try {
          const json = await response.json();
          if (json?.error) serverMsg = json.error;
        } catch {
          try {
            const text = await response.text();
            if (text) serverMsg = text;
          } catch {}
        }
        throw new Error(serverMsg);
      }

      // Success
      await response.json(); // if you need the result, assign it
      setMessage('School added successfully!');
      reset();
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(msg);
    }
  };

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <div className={styles['bg-blur']} />
        <div className={styles.container}>
          <h1 className={styles.title}>Add a New School</h1>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <input
              placeholder="School Name"
              {...register('name', { required: 'School name is required' })}
            />
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}

            <input
              placeholder="Address"
              {...register('address', { required: 'Address is required' })}
            />
            {errors.address && <p className={styles.error}>{errors.address.message}</p>}

            <div className={styles.grid}>
              <input
                placeholder="City"
                {...register('city', { required: 'City is required' })}
              />
              <input
                placeholder="State"
                {...register('state', { required: 'State is required' })}
              />
            </div>
            {errors.city && <p className={styles.error}>{errors.city.message}</p>}
            {errors.state && <p className={styles.error}>{errors.state.message}</p>}

            <input
              placeholder="Contact Number"
              type="tel"
              {...register('contact', { required: 'Contact number is required' })}
            />
            {errors.contact && <p className={styles.error}>{errors.contact.message}</p>}

            <input
              placeholder="Email Address"
              type="email"
              {...register('email_id', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email_id && <p className={styles.error}>{errors.email_id.message}</p>}

            <label htmlFor="image">School Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              {...register('image', { required: 'An image is required' })}
            />
            {errors.image && <p className={styles.error}>{errors.image.message}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add School'}
            </button>
          </form>

          {message && <p className={styles.message}>{message}</p>}
        </div>
      </main>
    </>
  );
}
