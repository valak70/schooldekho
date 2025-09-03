'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import styles from './addSchool.module.css';
import Navbar from '../components/Navbar';

export default function AddSchoolPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
  setMessage('');
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === 'image') {
      if (data.image && data.image[0]) {
        formData.append(key, data.image[0]);
      }
    } else {
      formData.append(key, data[key]);
    }
  });

  try {
    const response = await fetch('/api/schools', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong');
    }

    setMessage('School added successfully!');
    reset();
  } catch (error) {
    setMessage(error.message);
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
