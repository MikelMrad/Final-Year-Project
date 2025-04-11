"use client";
import { useQuery, useMutation } from "@apollo/client"
import { DELETE_TUTOR, GET_ALL_TUTORS } from "../data/queries"
import styles from "./style.module.css"

export default function TutorsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_TUTORS)
  const [deleteTutor] = useMutation(DELETE_TUTOR)

  const handleDelete = async (id: string) => {
    await deleteTutor({ variables: { id } })
    refetch()
  }

  if (loading) return <p>Loading...</p>
  if (error) {
    console.error("Error fetching tutors:", error);
    return <p>Error loading tutors</p>;
  }

  return (
    <div className={styles.container}>
      <h2>Tutors</h2>
      <ul>
        {data.tutors.map((tutor: any) => (
          <li key={tutor.id}>
            <div>
              <strong>{tutor.name}</strong> ({tutor.email}) – {tutor.hourlyRate}$
              <br />
              Subjects: {tutor.subjects.join(", ")}
            </div>
            <button onClick={() => handleDelete(tutor.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
