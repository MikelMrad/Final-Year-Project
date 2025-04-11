'use client'
import styles from './style.module.css'
import { useQuery } from '@apollo/client'
import { GET_ALL_STUDENTS } from '../data/queries'
import { useRouter } from 'next/navigation'

export default function TutorsPage() {
  const { data, loading } = useQuery(GET_ALL_STUDENTS)
  const router = useRouter()

  if (loading) return <p>Loading...</p>

  return (
    <div className={styles.container}>
      <h2>All Tutors</h2>
      <div className={styles.grid}>
        {data?.tutors.map((tutor: any) => (
          <div key={tutor.id} className={styles.card}>
            <h3>{tutor.name}</h3>
            <p>{tutor.email}</p>
            <button onClick={() => router.push(`/students/${student.id}`)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  )
}
