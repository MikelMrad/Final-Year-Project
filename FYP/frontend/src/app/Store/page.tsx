"use client"
import React from "react"
import { useQuery } from "@apollo/client"
import { Grid, Container } from "@mui/material"
import NavBar from "../../../modules/NavBar/index"
import Footer from "../../../modules/Footer"
import TutorItem from "../../../components/TutorItem/index"
import { GET_TUTORS_QUERY, GET_STUDENT_QUERY } from "@/data/queries"
import styles from "./style.module.css"
import { useAppSelector } from '@/redux/store'
import LoadingScreen from "../../../components/LoadingScreen/page"

interface Student {
  id: string
  weakPoints: string[]
  grade: number
}

interface Tutor {
  id: string
  name: string
  hourlyRate: number
  image: string
  workingHours: { day: string; startTime: string; endTime: string }[]
  subjects: string[]
  grade: number
}

export default function TutorsPage() {
  const userId = useAppSelector((state) => state.user.id)
  const { data, loading, error } = useQuery<{ student: Student }>(GET_STUDENT_QUERY, {
    variables: { id: userId },
  })
  const { data: tutorsData, loading: tutorsLoading, error: tutorsError } = useQuery<{ tutors: Tutor[] }>(GET_TUTORS_QUERY)

  if (tutorsLoading || loading)
    return (
      <div>
        <LoadingScreen />
      </div>
    )

  if (tutorsError || error)
    return <p>Error: {tutorsError?.message || error?.message}</p>

  const studentWeakPoints = data?.student?.weakPoints || []
  const normalizedWeakPoints = studentWeakPoints.map(point => point.toLowerCase().trim())
  const studentGrade = Number(data?.student?.grade) || 0

  const filteredTutors = tutorsData?.tutors?.filter((tutor) => {
    const subjectMatch = tutor.subjects.some((subject) =>
      normalizedWeakPoints.includes(subject.toLowerCase().trim())
    )
    const tutorGrade = Number(tutor.grade)
    const gradeMatch = tutorGrade >= studentGrade
    return subjectMatch && gradeMatch
  })

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className={styles.container}>
        {(filteredTutors?.length ?? 0) > 0 ? (
          <Grid container spacing={4}>
            {filteredTutors?.map((tutor) => (
              <Grid key={tutor.id} item xs={12} sm={6} md={4} lg={3}>
                <TutorItem
                  id={tutor.id}
                  name={tutor.name}
                  hourlyRate={tutor.hourlyRate}
                  image={tutor.image}
                  workingHours={tutor.workingHours}
                  subjects={tutor.subjects}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <div style={{ height: "80vh" }}>
            <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
              No tutors found for your weak points.
            </h2>
            <p style={{ textAlign: "center" }}>
              Please check back later or contact support for assistance.
            </p>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  )
}
