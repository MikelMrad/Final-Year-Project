'use client'
import React from 'react'
import Image from "next/image"
import styles from "./style.module.css"
import FirstPic from "../../../static/secondinfopic.jpg"
import SecondPic from "../../../static/firstInfoPic.jpg"
import NavBar from "../../../modules/NavBar/index"
import Banner from "../../../modules/Banner/index"
import Footer from "../../../modules/Footer/index"
import { useAppSelector } from '@/redux/store'
export default function page() {

  const username = useAppSelector((state) => state.login.username)

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
          style={{marginRight: '20px'}}>
          </Image>
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
              <img src='../../../static/subjects/chemistry.png' alt='Subject Picture'></img>
              Chemistry
            </div>
            <div className={styles.subject}>
            <img src='../../../static/subjects/relativity.png' alt='Subject Picture'></img>
              Physics
            </div>
            <div className={styles.subject}>
            <img src='../../../static/subjects/dna.png' alt='Subject Picture'></img>
              Biolody
            </div>
            <div className={styles.subject}>
            <img src='../../../static/subjects/logarithm.png' alt='Subject Picture'></img>
              Maths
            </div>
          </div>
          <div className={styles.images}>
            <div className={styles.subject}>
              <img src='../../../static/subjects/en.png' alt='Subject Picture'></img>
              English
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/france.png' alt='Subject Picture'></img>
              French
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/spain.png' alt='Subject Picture'></img>
              Spanish
            </div>
            <div className={styles.subject}>
              <img src='../../../static/subjects/dhad.png' alt='Subject Picture'></img>
              Arabic
            </div>
          </div>
          <div className={styles.images}>
            <div className={styles.subject}>
              <img src='../../../static/subjects/logarithm.png' alt='Subject Picture'></img>
              Algebra
            </div>
            <div className={styles.subject}>
            <img src='../../../static/subjects/algebra.png' alt='Subject Picture'></img>
              Calculus
            </div>
            <div className={styles.subject}>
            <img src='../../../static/subjects/philosophy.png' alt='Subject Picture'></img>
              Philosophy
            </div>
            <div className={styles.subject}>
            <img src='../../../static/subjects/monitor.png' alt='Subject Picture'></img>
              Information Technology
            </div>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div>
            <h1>What is TutorMe?</h1>
            <p>TutorMe is a platform that connects students with tutors. We offer a wide range of subjects and levels to suit your needs. Whether you are looking for help with homework, exam preparation or just want to learn something new, TutorMe has you covered.</p>
            <p>Our tutors are experienced professionals who are passionate about teaching and helping students succeed. They are available to provide one-on-one tutoring sessions in person or online, so you can learn at your own pace and in your own time.</p>
          </div>
            <Image
            src={SecondPic}
            className={styles.infoImage}
            alt='Informative Picture'
            style={{marginRight: '20px'}}>
            </Image>
          </div>
        </div>
      <Footer/>
    </div>
  )
}
