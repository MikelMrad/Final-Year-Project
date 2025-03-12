'use client'
import React from 'react';
import NavBar from "../../../modules/NavBar/index";
import styles from "./style.module.css";
import Footer from '../../../modules/Footer';

export default function page() {
  return (
    <div>
      <NavBar/>
        <div className={styles.container}>
          <h1 className={styles.heading}>Contact Us</h1>
          <p className={styles.paragraph}>
            We would love to hear from you! Whether you have a question about our products, an issue with your order, or just want to give us feedback, feel free to reach out to us anytime.
          </p>
          <div className={styles.contactInfo}>
            <h2 className={styles.subheading}>Our Contact Information</h2>
            <p className={styles.paragraph}>
              <strong>Email:</strong> <a className={styles.link} href="mailto:ecommerce@gmail.com">ecommerce@gmail.com</a>
            </p>
            <p className={styles.paragraph}>
              <strong>Phone:</strong> +961 012 345
            </p>
            <p className={styles.paragraph}>
              <strong>Address:</strong> 123 E-commerce St., Business City, Country
            </p>
          </div>
          <div className={styles.formSection}>
            <h2 className={styles.subheading}>Send Us a Message</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Name</label>
                <input type="text" id="name" className={styles.input} placeholder="Your Name" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input type="email" id="email" className={styles.input} placeholder="Your Email" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Message</label>
                <textarea id="message" className={styles.textarea} placeholder="Your Message" />
              </div>
              <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
          </div>
        </div>
      <Footer/>
    </div>
  )
}
