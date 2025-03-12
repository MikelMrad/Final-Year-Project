'use client'
import React from 'react';
import NavBar from "../../../modules/NavBar";
import styles from "./style.module.css";
import Footer from '../../../modules/Footer';

export default function page() {
  return (
    <div>
      <NavBar/>
      <div className={styles.container}>
        <h1 className={styles.heading}>About Us</h1>
        <p className={styles.paragraph}>
          Welcome to <strong className={styles.brand}>E-Commerce</strong>!
        </p>
        <p className={styles.paragraph}>
          At <strong className={styles.brand}>E-Commerce</strong>, we are passionate about providing our customers with 
          the best online shopping experience. Our mission is to offer a wide variety of quality products at affordable prices, 
          all while delivering exceptional customer service.
        </p>
        <p className={styles.paragraph}>
          Founded in [Year], we started as a small team with a big dream: to make shopping easy, fun, and accessible to everyone. 
          Today, we continue to grow while staying committed to our core values of trust, quality, and innovation.
        </p>
        <p className={styles.paragraph}>
          We believe in creating a community around our brand, where customers are not just buyers, but part of our family. 
          Thank you for choosing <strong className={styles.brand}>E-Commerce</strong>. We look forward to serving you!
        </p>
        <p className={styles.paragraph}>
          <strong>Our Vision:</strong> To be the leading e-commerce platform, known for our dedication to customer satisfaction 
          and innovative shopping experiences.
        </p>
        <p className={styles.paragraph}>
          <strong>Our Values:</strong> Integrity, Quality, Customer Focus, and Innovation.
        </p>
      </div>
      <Footer/>
    </div>
  )
}
