"use client"
import React, { useState } from "react"
import styles from "./style.module.css"
import { logIn } from "@/redux/features/loginSlice"
import { setUser } from "@/redux/features/userSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client"
import { LOGIN_STUDENT_MUTATION } from "@/data/queries"

interface LoginResponse {
  loginStudent: {
    id: string
    name: string
    email: string
    token: string
    image: string
  }
}

interface LoginVariables {
  email: string
  password: string
}

export default function StudentLoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [login] = useMutation<LoginResponse, LoginVariables>(LOGIN_STUDENT_MUTATION)

  const validateForm = (): boolean => {
    if (!email || !password) {
      alert("Please fill in all fields.")
      return false
    }
    if (!email.includes("@")) {
      alert("Please enter a valid email.")
      return false
    }
    if (password.length < 6) {
      alert("Password must be at least 8 characters.")
      return false
    }
    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const { data } = await login({
        variables: {
          email: email.toLowerCase(),
          password,
        },
        context: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      })

      const student = data?.loginStudent
      if (!student) throw new Error("Login failed. No user data returned.")

      localStorage.setItem("token", student.token)
      dispatch(logIn({ token: student.token, username: student.name, email: student.email }))
      dispatch(setUser({ ...student, type: "student" }))
      router.push("/Landing")
    } catch (err) {
      let message = "Login failed!"
      if (err instanceof Error) {
        if (err.message.includes("405")) {
          message = "Server error: Invalid request method. Try again later."
        } else if (err.message.includes("Network")) {
          message = "Network error. Please check your internet connection."
        } else {
          message = err.message
        }
      }
      console.error(message)
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <div className={styles.formContainer}>
          <h2>Sign In as Student</h2>
          <form onSubmit={handleLogin} className={styles.form}>
            <label>Email</label>
            <input
              type="text"
              placeholder="Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className={styles.signInButton}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className={styles.welcomeSection}>
          <h2>Welcome to TutorMe</h2>
          <p>Don't have an account?</p>
          <button
            className={styles.signUpButton}
            onClick={() => router.push("/RegisterStudent")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
