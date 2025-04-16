"use client"
import React, { useEffect, useState } from "react"
import { useAppSelector } from "@/redux/store"
import { useQuery } from "@apollo/client"
import {
  TUTOR_APPOINTMENTS_QUERY,
  STUDENT_APPOINTMENTS_QUERY,
} from "@/data/queries"
import NavBar from "../../../modules/NavBar"
import Footer from "../../../modules/Footer"
import { Box, Typography, CircularProgress, Container } from "@mui/material"
import { Calendar, momentLocalizer, Event as CalendarEvent, Views } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import styles from './style.module.css'

const localizer = momentLocalizer(moment)

interface Appointment {
  id: string
  date: string
  confirmed: boolean
  student: {
    name: string
  }
  tutor: {
    name: string
  }
}

const CalendarPage = () => {
  const user = useAppSelector((state) => state.user)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const isTutor = user.type === "tutor"
  const id = user.id

  const { data, loading } = useQuery<{ tutorAppointments?: Appointment[]; studentAppointments?: Appointment[] }>(
    isTutor ? TUTOR_APPOINTMENTS_QUERY : STUDENT_APPOINTMENTS_QUERY,
    { variables: isTutor ? { tutorId: id } : { studentId: id } }
  )

  useEffect(() => {
    if (data) {
      const appointments =
      user.type === "tutor"
        ? data?.tutorAppointments
        : data?.studentAppointments

    const confirmedEvents = appointments
      ?.filter((appt) => appt.confirmed)
      .map((appt) => {
        const startDate = new Date(parseInt(appt.date))
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
        const startTime = moment(startDate).format("h:mm A")
        const endTime = moment(endDate).format("h:mm A")
        return {
          id: appt.id,
          title: (
            <>
              {user.type === "tutor"
                ? `With ${appt.student?.name}`
                : `With ${appt.tutor?.name}`}
              <br />
              at {startTime} - {endTime}
            </>
          ),
          start: startDate,
          end: endDate,
        }
      })
            setEvents(confirmedEvents || [])
          }
        }, [data, isTutor])

  const handleNavigate = (date: Date) => {
    setCurrentDate(date)
  }

  return (
    <>
      <NavBar />
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: "Bebas Neue", mb: 3 }}>
          {isTutor ? "Tutor" : "Student"} Confirmed Appointments
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              height: "75vh",
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={{ month: true }}
              step={60}
              timeslots={1}
              defaultView={Views.MONTH}
              style={{ height: "100%", padding: "1rem" }}
              eventPropGetter={(event) => ({
                className: styles.eventCell,
              })}
              onNavigate={handleNavigate}
              date={currentDate}
            />
          </Box>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default CalendarPage
