// app/admin-login/page.tsx (or AdminLogin.tsx)
"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/navigation"
import { LOGIN_ADMIN_MUTATION } from "../data/queries"
import styles from "./style.module.css"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const [loginAdmin, { loading, error }] = useMutation(LOGIN_ADMIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.loginAdmin?.token) {
        localStorage.setItem("token", data.loginAdmin.token)
        router.push("/dashboard")
      }
    },
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginAdmin({ variables: { email, password } })
    } catch (err) {
      console.error("Login failed", err)
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.greenButton} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p className={styles.error}>Login failed: {error.message}</p>}
        </form>
      </div>
    </div>
  )
}
