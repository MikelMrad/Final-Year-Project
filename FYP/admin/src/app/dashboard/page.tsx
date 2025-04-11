"use client"

import styles from "./style.module.css"
import Sidebar from "../../components/AdminSidebar/page"

export default function AdminDashboard() {
  const adminName = "Admin John"

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
