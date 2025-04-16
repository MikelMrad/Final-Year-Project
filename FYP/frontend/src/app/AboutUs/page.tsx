"use client"
import React from "react"
import { Container, Box, Typography, Divider } from "@mui/material"
import NavBar from "../../../modules/NavBar"
import Footer from "../../../modules/Footer"

export default function AboutUsPage() {
  return (
    <div style={{ backgroundColor: "#f8f9fa" }}>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, color: "#2c3e50" }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: "Bebas Neue, sans-serif", color: "#2980b9" }}>
            About TutorMe™
          </Typography>
          <Divider sx={{ width: "50%", margin: "auto", mb: 2, borderColor: "#ffb001" }} />
          <Typography variant="subtitle1" sx={{ fontStyle: "italic", color: "#34495e" }}>
            Empowering Education Through Personalized Tutoring
          </Typography>
        </Box>
        <Box sx={{ mb: 3, lineHeight: 1.6 }}>
          <Typography variant="body1" paragraph>
            TutorMe™ is an innovative educational platform designed to connect students with expert tutors in a variety of subjects. Our mission is to empower students to achieve academic excellence by providing personalized tutoring sessions that cater to individual learning needs.
          </Typography>
          <Typography variant="body1" paragraph>
            Built using the latest technologies including the MERN stack, GraphQL, and Material‑UI, TutorMe™ delivers a seamless, responsive user experience. Whether you're a student striving for success or a tutor eager to share your expertise, our platform offers the perfect environment for learning and growth.
          </Typography>
          <Typography variant="body1" paragraph>
            Our system features robust scheduling, secure payments, and a rating system that ensures quality tutoring. With dedicated dashboards for students, tutors, and administrators, TutorMe™ streamlines every step of your educational journey.
          </Typography>
          <Typography variant="body1" paragraph>
            At TutorMe™, we believe that personalized learning unlocks every student's potential. Join us today and transform your educational experience.
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", p: 2, backgroundColor: "#ffffff", borderRadius: 2, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: "Bebas Neue, sans-serif", color: "#2980b9" }}>
            Our Vision & Values
          </Typography>
          <Typography variant="body1" paragraph>
            We envision a world where education is tailored to the unique needs of every student. At TutorMe™, cutting-edge technology meets expert guidance to create an environment that nurtures academic success.
          </Typography>
          <Typography variant="body1" paragraph>
            Our core values—integrity, innovation, and dedication—drive us to continuously improve our platform and ensure every user receives the highest quality tutoring experience.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
