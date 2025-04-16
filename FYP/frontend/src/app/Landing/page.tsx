'use client'
import React from 'react'
import Image from "next/image"
import styles from "./style.module.css"
import FirstPic from "../../../static/secondinfopic.jpg"
import SecondPic from "../../../static/firstInfoPic.jpg"
import NavBar from "../../../modules/NavBar/index"
import Banner from "../../../modules/Banner/index"
import Footer from "../../../modules/Footer/index"

export default function page() {
  return (
    <div>
      <NavBar/>
      <Banner/>
      <div className={styles.infoContainers}>
        <div className={styles.infoContainer}>
          <Image
            src={FirstPic}
            alt='Informative Picture'
            className={styles.infoImage}
            style={{marginRight: '20px'}}
          />
          <div>
            <h1>What is TutorMe?</h1>
            <p>TutorMe is a platform that connects students with tutors. We offer a wide range of subjects and levels to suit your needs. Whether you are looking for help with homework, exam preparation or just want to learn something new, TutorMe has you covered.</p>
            <p>Our tutors are experienced professionals who are passionate about teaching and helping students succeed. They are available to provide one-on-one tutoring sessions in person or online, so you can learn at your own pace and in your own time.</p>
          </div>
        </div>
        <div className={styles.infoTextContainer}>
          <h1>Our Subjects</h1>
          <div className={styles.images}>
            <div className={styles.subject}>
              <img src='../../../static/subjects/chemistry.png' alt='Subject Picture' />
              Chemistry
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/relativity.png' alt='Subject Picture' />
              Physics
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/dna.png' alt='Subject Picture' />
              Biology
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/logarithm.png' alt='Subject Picture' />
              Maths
            </div>
          </div>
          <div className={styles.images}>
            <div className={styles.subject}>
              <img src='../../../static/subjects/en.png' alt='Subject Picture' />
              English
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/france.png' alt='Subject Picture' />
              French
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/spain.png' alt='Subject Picture' />
              Spanish
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/dhad.png' alt='Subject Picture' />
              Arabic
            </div>
          </div>
          <div className={styles.images}>
            <div className={styles.subject}>
              <img src='../../../static/subjects/logarithm.png' alt='Subject Picture' />
              Algebra
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/algebra.png' alt='Subject Picture' />
              Calculus
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/philosophy.png' alt='Subject Picture' />
              Philosophy
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/monitor.png' alt='Subject Picture' />
              Information Technology
            </div>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div>
            <h1>Why TutorMe?</h1>
            <p>At Tutor Me, we believe every student deserves personalized guidance to reach their full potential. Our platform connects learners with expert tutors who are passionate about teaching and committed to academic success.</p>
            <p>Whether you're struggling with a subject or aiming to get ahead, we provide tailored sessions that fit your goals and schedule. We prioritize flexibility, affordability, and quality, ensuring every student gets the support they need. With TutorMe, learning becomes easier, more engaging, and genuinely empowering. Join us and experience education that’s built around you.</p>
          </div>
          <Image
            src={SecondPic}
            className={styles.infoImage}
            alt='Informative Picture'
            style={{marginRight: '20px'}}
          />
        </div>
      </div>
      <Footer/>
    </div>
  )
}
