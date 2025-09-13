'use client';

import { useEffect, useState } from 'react';
import styles from './showSchools.module.css';
import Navbar from '../components/Navbar';

async function getSchools() {
  const res = await fetch('/api/schools');
  if (!res.ok) throw new Error('Failed to fetch schools');
  return res.json();
}

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingSchool, setEditingSchool] = useState(null); // modal control
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState(null); // login state

  // Fetch schools
  useEffect(() => {
    getSchools()
      .then(data => setSchools(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Check login
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  async function handleDelete(id) {
    if (!user) return alert('You need to be logged in to delete a school!');
    try {
      const res = await fetch(`/api/schools?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSchools(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!user) return alert('You need to be logged in to edit a school!');

    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) form.append(key, val);
    });

    try {
      const res = await fetch(`/api/schools?id=${editingSchool.id}`, {
        method: 'PUT',
        body: form,
      });
      if (!res.ok) throw new Error('Update failed');

      const updated = await getSchools();
      setSchools(updated);
      setEditingSchool(null);
    } catch (err) {
      alert(err.message);
    }
  }

  function openEditModal(school) {
    if (!user) return alert('You need to be logged in to edit a school!');
    setEditingSchool(school);
    setFormData(school);
  }

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
                <img src={school.image} alt={school.name} className={styles.image} />
                <div className={styles.info}>
                  <h3>{school.name}</h3>
                  <p>{school.address}</p>
                  <span>{school.city}</span>
                </div>
                {user && (
                  <div className={styles.actions}>
                    <button onClick={() => openEditModal(school)}>Edit</button>
                    <button onClick={() => handleDelete(school.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingSchool && user && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit School</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                placeholder="Name"
                defaultValue={editingSchool.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Address"
                defaultValue={editingSchool.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                defaultValue={editingSchool.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingSchool(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
