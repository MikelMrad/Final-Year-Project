'use client'
import React, { useState } from 'react'
import styles from './style.module.css'
import WavyBackground from './wavybackground/page'
import Typewriter from './typewriter/page'
import { FaGraduationCap, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa'

const Page = () => {
  const phrases: string[] = [
    "Empowering students aged 15 and up with personalized learning solutions.",
    "Connect with expert tutors in STEM, Humanities, and College Prep.",
    "Take control of your academic future - start your journey today."
  ]

  const [currentPhrase, setCurrentPhrase] = useState<number>(0)

  return (
    <div className={styles.mainContainer}>
      <div className={styles.wavyBackground}>
        <WavyBackground />
      </div>
      
      <div className={styles.container}>
        {/* Left Panel with Content and Stats */}
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
              <h2>10,000+</h2>
              <p>Students Empowered</p>
            </div>
            <div className={styles.statItem}>
              <h2>95%</h2>
              <p>Success Rate</p>
            </div>
            <div className={styles.statItem}>
              <h2>24/7</h2>
              <p>Support Available</p>
            </div>
          </div>
        </div>

        {/* Right Panel with Buttons */}
        <div className={styles.rightContainer}>
          <div className={styles.authContainer}>
            <h2 className={styles.authHeading}>Begin Your Journey Now !!</h2>
            <button className={`${styles.authButton} ${styles.studentButton}`}>
              <FaGraduationCap className={styles.buttonIcon} />
              <span>Student Portal</span>
              <FaArrowRight className={styles.arrowIcon} />
            </button>
            <button className={`${styles.authButton} ${styles.tutorButton}`}>
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