'use client'
import { useQuery } from "@apollo/client"
import {  GET_ALL_TUTORS } from "../data/queries"
import Sidebar from "../../components/AdminSidebar/page"
import styles from "./style.module.css"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TutorsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_TUTORS)
  const router = useRouter()

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h2 className={styles.pageTitle}>Tutors</h2>

        {loading ? (
          <p style={{ color: "#2c3e50" }}>Loading...</p>
        ) : error ? (
          <p>Error loading tutors</p>
        ) : (
          <ul className={styles.tutorList}>
            {data.tutors.map((tutor: any) => (
              <li key={tutor.id} className={styles.tutorCard}>
                <div>
                  <strong>{tutor.name}</strong> ({tutor.email}) – ${tutor.hourlyRate}/hr
                  <br />
                  Subjects: {tutor.subjects.join(", ")}
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.editButton}
                    onClick={() =>router.push(`/tutors/${tutor.id}`)
                  }
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
