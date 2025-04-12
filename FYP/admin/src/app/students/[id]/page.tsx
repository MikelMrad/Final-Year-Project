'use client'

import { use } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { GET_STUDENT, UPDATE_STUDENT, DELETE_STUDENT } from "../../data/queries"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Sidebar from "../../../components/AdminSidebar/page"
import styles from "./style.module.css"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

interface StudentDetailPageProps {
  params: Promise<{ id: string }>
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()

  const { data, loading, error } = useQuery(GET_STUDENT, { variables: { id } })
  const [updateStudent] = useMutation(UPDATE_STUDENT)
  const [deleteStudent] = useMutation(DELETE_STUDENT)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    weakPoints: [] as string[],
    appointments: [] as string[],
    image: "",
  })

  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState("")
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success")

  useEffect(() => {
    if (data?.student) {
      const { name, email, weakPoints, appointments, image } = data.student
      setForm({ name, email, password: "", weakPoints, appointments: appointments.map((a: { id: string }) => a.id), image })
    }
  }, [data])

  const handleUpdate = async () => {
    try {
      await updateStudent({
        variables: {
          id,
          name: form.name,
          email: form.email,
          password: form.password,
          weakPoints: form.weakPoints,
          appointments: form.appointments,
          image: form.image,
        },
      })
      setSnackMessage("Student updated successfully!")
      setSnackSeverity("success")
      setSnackOpen(true)
      setTimeout(() => {
        router.push("/students")
      }, 1500)
    } catch (err) {
      setSnackMessage("Update failed.")
      setSnackSeverity("error")
      setSnackOpen(true)
    }
  }

  const handleDelete = async () => {
    await deleteStudent({ variables: { id } })
    router.push("/students")
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h2 className={styles.heading}>Edit Student</h2>

        {loading ? (
          <p className={styles.status}>Loading...</p>
        ) : error ? (
          <p className={styles.status}>Error loading student details.</p>
        ) : (
          <>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
            />

            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />

            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
            />

            <div className={styles.buttonGroup}>
              <button className={styles.button} onClick={handleUpdate}>
                Update
              </button>
              <button className={`${styles.button} ${styles.delete}`} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}
