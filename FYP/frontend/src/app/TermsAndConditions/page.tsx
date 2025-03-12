'use client'
import React from 'react'
import styles from './style.module.css'
import Footer from '../../../modules/Footer'
import NavBar from '../../../modules/NavBar'

export default function page() {
  return (
    <div>
      <NavBar/>
    <div className={styles.container}>
      <h1 className={styles.heading}>Terms and Conditions</h1>
      <p className={styles.paragraph}>
        Welcome to <strong className={styles.brand}>E-Commerce</strong>. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.
      </p>
      <h2 className={styles.subheading}>1. Introduction</h2>
      <p className={styles.paragraph}>
        These Terms and Conditions govern your use of our website and services. If you do not agree to these terms, please do not use our site.
      </p>
      <h2 className={styles.subheading}>2. Changes to Terms</h2>
      <p className={styles.paragraph}>
        We may update these terms from time to time. We will notify you of any changes by posting the new Terms and Conditions on this page. You are advised to review this page periodically for any changes.
      </p>
      <h2 className={styles.subheading}>3. Use of the Website</h2>
      <p className={styles.paragraph}>
        You agree to use our website only for lawful purposes and in a way that does not infringe the rights of others or restrict or inhibit anyone else's use of the website.
      </p>
      <h2 className={styles.subheading}>4. Intellectual Property Rights</h2>
      <p className={styles.paragraph}>
        All content on this site, including text, graphics, logos, and images, is the property of <strong className={styles.brand}>E-Commerce</strong> or our content suppliers and is protected by copyright laws.
      </p>
      <h2 className={styles.subheading}>5. Limitation of Liability</h2>
      <p className={styles.paragraph}>
        In no event will <strong className={styles.brand}>E-Commerce</strong> be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the site.
      </p>
      <h2 className={styles.subheading}>6. Contact Us</h2>
      <p className={styles.paragraph}>
        If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:ecommerce@gmail.com" className={styles.link}>ecommerce@gmail.com</a>.
      </p>
    </div>
      <Footer/>
    </div>
  )
}
