"use client"
import { useQuery, useMutation } from "@apollo/client"
import { DELETE_APPOINTMENT, GET_ALL_APPOINTMENTS } from "../data/queries"
import styles from "./style.module.css"

export default function AppointmentsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_APPOINTMENTS)
  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT)

  const handleDelete = async (id: string) => {
    await deleteAppointment({ variables: { id } })
    refetch()
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading appointments</p>

  return (
    <div className={styles.container}>
      <h2>Appointments</h2>
      <ul>
        {data.getAllAppointments.map((appt: any) => (
          <li key={appt._id}>
            <div>
              <strong>{appt.studentName}</strong> with <strong>{appt.tutorName}</strong>
              <br />
              {appt.date} at {appt.time} – {appt.status}
            </div>
            <button onClick={() => handleDelete(appt._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
