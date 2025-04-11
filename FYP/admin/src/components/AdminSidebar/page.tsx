"use client"

import Link from "next/link"
import styles from "./style.module.css"
import { usePathname } from "next/navigation"

const AdminSidebar = () => {
  const pathname = usePathname()

  const links = [
    { label: "Home", href: "/dashboard" },
    { label: "Tutors", href: "/tutors" },
    { label: "Students", href: "/students" },
    { label: "Appointments", href: "/appointments" },
  ]

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>Admin Panel</h2>
      <ul className={styles.navList}>
        {links.map((link) => (
          <li key={link.href}>
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
    </aside>
  )
}

export default AdminSidebar
