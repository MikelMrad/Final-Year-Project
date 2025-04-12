'use client'

import { useQuery } from "@apollo/client"
import { GET_ALL_STUDENTS } from "../data/queries"
import Sidebar from "../../components/AdminSidebar/page"
import styles from "./style.module.css"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function StudentsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_STUDENTS)
  const router = useRouter()

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h2 className={styles.pageTitle}>Students</h2>

        {loading ? (
          <p style={{ color: "#2c3e50" }}>Loading...</p>
        ) : error ? (
          <p>Error loading students</p>
        ) : (
          <ul className={styles.tutorList}>
            {data.students.map((student: any) => (
              <li key={student.id} className={styles.tutorCard}>
                <div>
                  <strong>{student.name}</strong> ({student.email})
                  <br />
                  Weak Points: {student.weakPoints.join(", ")}
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.editButton}
                    onClick={() => router.push(`/students/${student.id}`)}
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
