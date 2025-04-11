"use client"

import React, { useEffect, useState } from "react"
import { Container, Typography, TextField, Button, Snackbar, Alert } from "@mui/material"
import { useMutation, useQuery } from "@apollo/client"
import { useAppSelector } from "@/redux/store"
import {
  GET_STUDENT_QUERY,
  GET_TUTOR_QUERY,
  UPDATE_STUDENT_MUTATION,
  UPDATE_TUTOR_MUTATION,
} from "@/data/queries"
import NavBar from "../../../modules/NavBar"
import Footer from "../../../modules/Footer"
import styles from "./style.module.css"

export default function ProfilePage() {
  const user = useAppSelector((state) => state.user)
  const isTutor = user.type === "tutor"
  const [formData, setFormData] = useState<any>({})
  const [success, setSuccess] = useState(false)

  const { data: studentData } = useQuery(GET_STUDENT_QUERY, {
    variables: { id: user.id },
    skip: isTutor,
  })

  const { data: tutorData } = useQuery(GET_TUTOR_QUERY, {
    variables: { id: user.id },
    skip: !isTutor,
  })

  const [updateStudent] = useMutation(UPDATE_STUDENT_MUTATION)
  const [updateTutor] = useMutation(UPDATE_TUTOR_MUTATION)

  useEffect(() => {
    if (!isTutor && studentData) {
      setFormData({
        name: studentData.student.name,
        email: studentData.student.email,
        weakPoints: studentData.student.weakPoints.join(", "),
        image: studentData.student.image || user.image,
      })
    } else if (isTutor && tutorData) {
      setFormData({
        name: tutorData.tutor.name,
        email: tutorData.tutor.email,
        hourlyRate: tutorData.tutor.hourlyRate,
        subjects: tutorData.tutor.subjects.join(", "),
        image: tutorData.tutor.image,
      })
    }
  }, [studentData, tutorData, isTutor, user.image])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const variables: any = {
      id: user.id,
      name: formData.name,
      email: formData.email,
      image: formData.image,
    }

    if (isTutor) {
      if (formData.subjects) variables.subjects = formData.subjects.split(",").map((s : any) => s.trim())
      if (formData.hourlyRate) variables.hourlyRate = parseFloat(formData.hourlyRate)
      await updateTutor({ variables })
    } else {
      if (formData.weakPoints) variables.weakPoints = formData.weakPoints.split(",").map((w : any) => w.trim())
      await updateStudent({ variables })
    }

    setSuccess(true)
  }

  return (
    <div>
      <NavBar />
      <Container className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <img src={formData.image} alt="User" className={styles.profileImage} />
          <div className={styles.profileInfo}>
            <Typography variant="h4" className={styles.title}>Profile Info</Typography>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className={styles.input}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className={styles.input}
            />

            {!isTutor && (
              <TextField
                fullWidth
                label="Weak Points"
                name="weakPoints"
                value={formData.weakPoints || ""}
                onChange={handleChange}
                className={styles.input}
                helperText="Separate by commas (Use subjects diaplayed in the home page)"
              />
            )}

            {isTutor && (
              <>
                <TextField
                  fullWidth
                  label="Hourly Rate"
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate || ""}
                  onChange={handleChange}
                  className={styles.input}
                />
                <TextField
                  fullWidth
                  label="Subjects"
                  name="subjects"
                  value={formData.subjects || ""}
                  onChange={handleChange}
                  className={styles.input}
                helperText="Separate by commas (Use subjects diaplayed in the home page)"
                />
              </>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              className={styles.updateButton}
            >
              Update
            </Button>
          </div>
        </div>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>

      <Footer />
    </div>
  )
}
