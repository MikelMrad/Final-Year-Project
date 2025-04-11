"use client"
import { useQuery, useMutation } from "@apollo/client"
import { DELETE_STUDENT, GET_ALL_STUDENTS } from "../data/queries"
import styles from "./style.module.css"

export default function StudentsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_STUDENTS)
  const [deleteStudent] = useMutation(DELETE_STUDENT)

  const handleDelete = async (id: string) => {
    await deleteStudent({ variables: { id } })
    refetch()
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading students</p>

  return (
    <div className={styles.container}>
      <h2>Students</h2>
      <ul>
        {data.getAllStudents.map((student: any) => (
          <li key={student._id}>
            <div>
              <strong>{student.name}</strong> ({student.email})
              <br />
              Weak Points: {student.weakPoints.join(", ")}
            </div>
            <button onClick={() => handleDelete(student._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
