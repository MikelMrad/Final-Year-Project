"use client"
import React from "react"
import Image from "next/image"
import styles from "./style.module.css"
import logo from "../../static/tutormelogo.png"

export default function LoadingScreen() {
  return (
    <div className={styles.container}>
      <Image src={logo} alt="TutorMe Logo" width={250}  />
      <div className={styles.dots}>
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
      </div>
    </div>
  )
}
