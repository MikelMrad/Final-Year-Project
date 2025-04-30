"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import styles from "./style.module.css"

const AdminSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Example logout logic: clear token and redirect to login page
    localStorage.removeItem("token")
    router.push("/login")
  }

  const links = [
    { label: "Home", href: "/dashboard" },
    { label: "Tutors", href: "/tutors" },
    { label: "Students", href: "/students" },
    { label: "Expenses", href: "/expenses" },
    { label: "Appointments", href: "/appointments" },
  ]

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>Admin Panel</h2>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {links.map((link) => (
            <li key={link.href} className={styles.navItem}>
              <Link
                href={link.href}
                className={`${styles.link} ${
                  pathname === link.href ? styles.active : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </aside>
  )
}

export default AdminSidebar
