"use client"
import React, { useState } from "react"
import styles from "./style.module.css"
import { logIn } from "@/redux/features/loginSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client"
import { LOGIN_TUTOR_MUTATION } from "@/data/queries"
import { setUser } from "@/redux/features/userSlice"

interface LoginResponse {
  loginTutor: {
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

export default function TutorLoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [login] = useMutation<LoginResponse, LoginVariables>(LOGIN_TUTOR_MUTATION)

  const validateForm = (): boolean => {
    if (!userEmail || !password) {
      alert("Please fill in all fields")
      return false
    }
    if (!userEmail.includes("@")) {
      alert("Please enter a valid email address")
      return false
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long")
      return false
    }
    return true
  }

  const onclickLogIn = async (): Promise<void> => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const { data } = await login({
        variables: {
          email: userEmail.toLowerCase(),
          password,
        },
        context: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      })

      if (!data?.loginTutor) {
        throw new Error("No data returned from login")
      }

      const { id, token, name, email, image } = data.loginTutor

      localStorage.setItem("token", token)
      dispatch(logIn({ token, username: name, email }))
      dispatch(setUser({ id, name, email, type: "tutor", token, image }))
      router.push("/Landing")
    } catch (err) {
      let errorMessage = "Login failed!"
      if (err instanceof Error) {
        if (err.message.includes("405")) {
          errorMessage =
            "Server error: Invalid request method. Please try again later."
        } else if (err.message.includes("Network")) {
          errorMessage = "Network error. Please check your connection."
        } else {
          errorMessage = err.message
        }
      }
      console.error(errorMessage)
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <div className={styles.formContainer}>
          <h2>Sign In as Tutor</h2>
          <div className={styles.form}>
            <label>Email</label>
            <input
              type="text"
              placeholder="Email"
              onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className={styles.signInButton}
              onClick={onclickLogIn}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>
        <div className={styles.welcomeSection}>
          <h2>Welcome to TutorMe</h2>
          <p>Don't have an account?</p>
          <button
            className={styles.signUpButton}
            onClick={() => router.push("/RegisterTutor")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
