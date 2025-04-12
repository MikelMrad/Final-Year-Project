"use client"
import { useQuery } from "@apollo/client"
import styles from "./style.module.css"
import Sidebar from "../../components/AdminSidebar/page"
import { GET_ADMIN_PROFILE } from "../data/queries"

export default function AdminDashboard() {
  const { data, loading, error } = useQuery(GET_ADMIN_PROFILE)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const adminName = data?.getAdminProfile?.name || "Admin"

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1>Welcome, {adminName} 👋</h1>
        <p>Here’s your admin dashboard overview.</p>
      </div>
    </div>
  )
}
