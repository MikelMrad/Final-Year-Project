'use client'
import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import WavyBackground from './wavybackground/page'
import Typewriter from './typewriter/page'
import { setUser } from "@/redux/features/userSlice"
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppDispatch } from "@/redux/store"
import { FaGraduationCap, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa'

const Page = () => {
  const dispatch = useDispatch<AppDispatch>()

  const phrases: string[] = [
    "Empowering students aged 15 and up with personalized learning solutions.",
    "Connect with expert tutors in STEM, Humanities, and College Prep.",
    "Take control of your academic future - start your journey today."
  ]

  const [currentPhrase, setCurrentPhrase] = useState<number>(0)
  const router = useRouter()

  const handleButtonClick = (type: "tutor" | "student") => {
    dispatch(setUser({ name: "", email: "", type, token: "" }))
    router.push('/Login')
  }

  const [students, setStudents] = useState(0)
  const [successRate, setSuccessRate] = useState(0)
  const [support, setSupport] = useState(0)

  useEffect(() => {
    const animateValue = (setter: React.Dispatch<React.SetStateAction<number>>, start: number, end: number, duration: number) => {
      let startTime: number | null = null
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setter(Math.floor(progress * (end - start) + start))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    animateValue(setStudents, 0, 10000, 2000)
    animateValue(setSuccessRate, 0, 95, 1500)
    animateValue(setSupport, 0, 24, 1800)
  }, [])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.wavyBackground}>
        <WavyBackground />
      </div>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.contentSection}>
            <h1 className={styles.mainHeading}>
              <span className={styles.headingAccent}>TutorMe™</span> Academy
            </h1>
            <div className={styles.contentWrapper}>
              {phrases.slice(0, currentPhrase).map((phrase, index) => (
                <h2 key={index} className={styles.animatedText}>{phrase}</h2>
              ))}
              {currentPhrase < phrases.length && (
                <Typewriter 
                  text={phrases[currentPhrase]}
                  speed={40}
                  onDone={() => setCurrentPhrase(currentPhrase + 1)}
                />
              )}
            </div>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <h3>{students.toLocaleString()}+</h3>
              <p>Students Empowered</p>
            </div>
            <div className={styles.statItem}>
              <h3>{successRate}%</h3>
              <p>Success Rate</p>
            </div>
            <div className={styles.statItem}>
              <h3>{support}/7</h3>
              <p>Support Available</p>
            </div>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.authContainer}>
            <h2 className={styles.authHeading}>Begin Your Journey Now !!</h2>
            <button className={`${styles.authButton} ${styles.studentButton}`} onClick={() => handleButtonClick("student")}>
              <FaGraduationCap className={styles.buttonIcon}/>
              <span>Student Portal</span>
              <FaArrowRight className={styles.arrowIcon} />
            </button>
            <button className={`${styles.authButton} ${styles.tutorButton}`} onClick={() => handleButtonClick("tutor")}>
              <FaChalkboardTeacher className={styles.buttonIcon} />
              <span>Tutor Network</span>
              <FaArrowRight className={styles.arrowIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
