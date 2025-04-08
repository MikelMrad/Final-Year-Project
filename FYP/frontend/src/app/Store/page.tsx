"use client"
import React from "react"
import { useQuery } from "@apollo/client"
import { Grid2 } from '@mui/material'
import { Container, CircularProgress } from "@mui/material"
import NavBar from "../../../modules/NavBar/index"
import Footer from "../../../modules/Footer"
import TutorItem from "../../../components/TutorItem/index"
import { GET_TUTORS_QUERY } from "@/data/queries"
import styles from "./style.module.css"

export default function TutorsPage() {
  const { data, loading, error } = useQuery(GET_TUTORS_QUERY)

  if (loading) return <CircularProgress />
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className={styles.container} >
        <Grid2 container spacing={4}>
          {data.tutors.map((tutor: any) => (
            <Grid2 key={tutor.id} xs={12} sm={6} md={3}>
              <TutorItem
                id={tutor.id}
                name={tutor.name}
                hourlyRate={tutor.hourlyRate}
                image={tutor.image}
                workingHours={tutor.workingHours}
              />
            </Grid2>
          ))}
        </Grid2>
      </Container>
      <Footer />
    </div>
  )
}
