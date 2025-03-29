'use client'
import React, { useState } from 'react'
import styles from "./style.module.css"
import Image from "next/image"
import Logo from "../../../static/logo.png"
import { logIn, logOut } from "@/redux/features/loginSlice"
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'
import Footer from '../../../modules/Footer'
import { useRouter } from 'next/navigation'
import { useMutation } from "@apollo/client";
import { LOGIN_TUTOR_MUTATION } from "@/data/queries";
import { GET_TUTOR_QUERY } from './../../data/queries';

export default function Page() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const username = useAppSelector((state) => state.login.username)

  const [userEmail, setUserEmail] = useState("")
  const [password, setPassword] = useState("")

  const [login] = useMutation(LOGIN_TUTOR_MUTATION);

  const onclickLogIn = async () => {
    try {
      const { data } = await login({
        variables: { email: userEmail, password: password },
      });

      localStorage.setItem("token", data.login.token);
      dispatch(logIn({ token: data.login.token, username: data.login.username, email: data.login.email }));
      alert("Login successful!");
    } catch (error) {
      console.error(error)
      alert("Invalid credentials!")
    }
  }

  const onclickLogOut = () => {
    localStorage.removeItem('token')
    dispatch(logOut())
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <div className={styles.formContainer}>
          <h2>Sign In</h2>
          <div className={styles.form}>
            <label>Email</label>
            <input type="text" placeholder="Email" onChange={(e) => setUserEmail(e.target.value)} />
            <label>Password</label>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button className={styles.signInButton} onClick={onclickLogIn}>Sign In</button>
          </div>
        </div>
        <div className={styles.welcomeSection}>
          <h2>Welcome to TutorMe</h2>
          <p>Don't have an account?</p>
          <button className={styles.signUpButton} onClick={() => router.push('/signUp')}>Sign Up</button>
        </div>
      </div>
    </div>
  )
}
