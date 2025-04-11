'use client';
import { use } from 'react'; // Experimental hook to unwrap promises
import { useQuery, useMutation } from '@apollo/client';
import { GET_TUTOR, UPDATE_TUTOR, DELETE_TUTOR } from '../../data/queries';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '../../../components/AdminSidebar/page'; // Adjust the relative path as needed
import styles from './detailStyle.module.css';

interface TutorDetailPageProps {
  // params is now a Promise that resolves to an object with an id string.
  params: Promise<{ id: string }>;
}

export default function TutorDetailPage({ params }: TutorDetailPageProps) {
  // Unwrap the promise using React's use() (experimental)
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_TUTOR, { variables: { id } });
  const [updateTutor] = useMutation(UPDATE_TUTOR);
  const [deleteTutor] = useMutation(DELETE_TUTOR);
  const [form, setForm] = useState({ name: '', email: '', hourlyRate: '' });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tutor details.</p>;

  const tutor = data?.tutor;

  const handleUpdate = async () => {
    await updateTutor({ variables: { id, ...form } });
    alert('Updated successfully!');
  };

  const handleDelete = async () => {
    await deleteTutor({ variables: { id } });
    router.push('/tutors');
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <div className={styles.detailContainer}>
        <h2>Edit Tutor</h2>
        <input
          className={styles.input}
          value={form.name || tutor.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
        />
        <input
          className={styles.input}
          value={form.email || tutor.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />
        <input
          className={styles.input}
          value={form.hourlyRate || tutor.hourlyRate}
          onChange={e => setForm({ ...form, hourlyRate: e.target.value })}
          placeholder="Hourly Rate"
        />
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={handleUpdate}>
            Update
          </button>
          <button className={`${styles.button} ${styles.delete}`} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
