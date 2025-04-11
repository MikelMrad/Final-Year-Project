import styles from '../../../styles/detailStyle.module.css'
import { useQuery, useMutation } from '@apollo/client'
import { GET_STUDENT, UPDATE_STUDENT, DELETE_STUDENT } from '../data/queries'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function TutorDetail() {
  const router = useRouter()
  const { id } = router.query
  const { data, loading } = useQuery(GET_STUDENT, { variables: { id } })
  const [updateTutor] = useMutation(UPDATE_STUDENT)
  const [deleteTutor] = useMutation(DELETE_STUDENT)
  const [form, setForm] = useState({ name: '', email: '', hourlyRate: '' })

  if (loading) return <p>Loading...</p>
  const tutor = data?.tutor

  const handleUpdate = async () => {
    await updateTutor({ variables: { id, ...form } })
    alert('Updated successfully!')
  }

  const handleDelete = async () => {
    await deleteTutor({ variables: { id } })
    router.push('/students')
  }

  return (
    <div className={styles.container}>
      <h2>Edit Tutor</h2>
      <input value={form.name || tutor.name} onChange={e => setForm({...form, name: e.target.value})} />
      <input value={form.email || tutor.email} onChange={e => setForm({...form, email: e.target.value})} />
      <input value={form.hourlyRate || tutor.hourlyRate} onChange={e => setForm({...form, hourlyRate: e.target.value})} />
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete} className={styles.delete}>Delete</button>
    </div>
  )
}
