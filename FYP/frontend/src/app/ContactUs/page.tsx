"use client"
import React, { useState, FormEvent } from "react"
import { Container, Box, TextField, Typography, Button, Grid2 } from "@mui/material"
import NavBar from "../../../modules/NavBar"
import Footer from "../../../modules/Footer"

export default function ContactUsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!name || !email || !subject || !message) {
      setError("Please fill all required fields")
      return
    }
    setSuccess("Your message has been sent successfully!")
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: "Bebas Neue, sans-serif", color: "#2980b9" }}>
            Contact Us
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#2c3e50" }}>
            Have a question or need assistance? Reach out to us!
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ backgroundColor: "#fff", borderRadius: 2, p: 4, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
        >
          {error && (
            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
              {success}
            </Typography>
          )}
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Subject"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Message"
                fullWidth
                multiline
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid2>
          </Grid2>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button variant="contained" color="primary" type="submit" size="large">
              Send Message
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
