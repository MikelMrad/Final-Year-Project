'use client'

import { useMutation, useQuery } from "@apollo/client"
import { GET_ALL_APPOINTMENTS, CONFIRM_APPOINTMENT, DELETE_APPOINTMENT, UPDATE_APPOINTMENT } from "../data/queries"
import Sidebar from "../../components/AdminSidebar/page"
import styles from "./style.module.css"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AppointmentsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_APPOINTMENTS)
  const [confirmAppointment] = useMutation(CONFIRM_APPOINTMENT)
  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT)
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT)
  const router = useRouter()

  useEffect(() => {
    refetch()
  }, [])

  const handleConfirm = async (id: string) => {
    try {
      await confirmAppointment({ variables: { id } })
      refetch()
    } catch (err) {
      console.error("Confirm error:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment({ variables: { id } })
      refetch()
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handlePaid = async (id: string) => {
    try {
      await updateAppointment({ variables: { id, isPaid: true } })
      refetch()
    } catch (err) {
      console.error("Paid error:", err)
    }
  }

  const parseDate = (value: any): Date => {
    let d = new Date(value)
    if (isNaN(d.getTime()) && typeof value === "string") {
      const numeric = Number(value)
      d = new Date(numeric)
    }
    return d
  }

  const formatDate = (value: any) => {
    const d = parseDate(value)
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString()
  }

  const formatTime = (value: any) => {
    const d = parseDate(value)
    return isNaN(d.getTime())
      ? "Invalid Time"
      : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getEndTime = (value: any) => {
    const d = parseDate(value)
    if (isNaN(d.getTime())) return "Invalid Time"
    d.setHours(d.getHours() + 1)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h2 className={styles.pageTitle}>Appointments</h2>
        {loading ? (
          <p style={{ color: "#2c3e50" }}>Loading...</p>
        ) : error ? (
          <p>Error loading appointments</p>
        ) : (
          <ul className={styles.tutorList}>
            {data?.appointments.map((appt: any) => (
              <li key={appt.id} className={styles.tutorCard}>
                <div>
                  <strong>Date:</strong> {formatDate(appt?.date)} <br />
                  <strong>Start:</strong> {formatTime(appt?.date)} <br />
                  <strong>End:</strong> {getEndTime(appt?.date)} <br />
                  <strong>Tutor:</strong> {appt?.tutor?.name} <br />
                  <strong>Student:</strong> {appt?.student?.name} <br />
                  <strong>Status:</strong> {appt.confirmed ? "✅ Confirmed" : "❌ Not Confirmed"} <br />
                  <strong>Paid:</strong> {appt.isPaid ? "✅ Paid" : "❌ Not Paid"}
                </div>
                <div className={styles.buttonGroup}>
                  {!appt.confirmed && (
                    <button
                      className={styles.editButton}
                      onClick={() => handleConfirm(appt?.id)}
                    >
                      Confirm
                    </button>
                  )}
                  {!appt.isPaid && (
                    <button
                      className={`${styles.editButton} ${styles.paidButton}`}
                      onClick={() => handlePaid(appt?.id)}
                      style={{ backgroundColor: "green", color: "white" }}
                    >
                      Paid
                    </button>
                  )}
                  <button
                    className={`${styles.editButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(appt?.id)}
                  >
                    Delete
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
