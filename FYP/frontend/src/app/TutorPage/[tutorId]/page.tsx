"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Box
} from "@mui/material"
import { useQuery, useMutation } from "@apollo/client"
import {
  GET_TUTOR_QUERY,
  ADD_APPOINTMENT_MUTATION,
  GET_TUTOR_APPOINTMENTS_QUERY,
} from "@/data/queries"
import NavBar from "../../../../modules/NavBar"
import Footer from "../../../../modules/Footer"
import { useAppSelector } from "@/redux/store"
import styles from "../style.module.css"
import LoadingScreen from "../../../../components/LoadingScreen/page"

interface WorkingHour {
  day: string
  startTime: string
  endTime: string
}

interface Tutor {
  id: string
  name: string
  email: string
  hourlyRate: number
  subjects: string[]
  image: string
  workingHours: WorkingHour[]
}

interface TutorData {
  tutor: Tutor
}

interface Appointment {
  id: string
  date: string
  confirmed: boolean
}

interface AppointmentsData {
  tutorAppointments: Appointment[]
}

export interface Slot {
  day: string
  startTime: string
  endTime: string
  fullDate: string
}

interface TutorDetailPageProps {
  params: { tutorId: string }
}

export default function TutorDetailPage({ params }: TutorDetailPageProps) {
  const tutorId = params.tutorId
  const router = useRouter()
  const user = useAppSelector((state) => state.user)
  const CURRENT_STUDENT_ID = user.id

  const [availableSessions, setAvailableSessions] = useState<Slot[]>([])
  const [selectedSession, setSelectedSession] = useState<Slot | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { data: tutorData, loading: tutorLoading } = useQuery<TutorData>(GET_TUTOR_QUERY, {
    variables: { id: tutorId },
  })

  const { data: appointmentsData, loading: appointmentsLoading } = useQuery<AppointmentsData>(
    GET_TUTOR_APPOINTMENTS_QUERY,
    { variables: { tutorId } }
  )

  const [addAppointment] = useMutation(ADD_APPOINTMENT_MUTATION, {
    refetchQueries: [{ query: GET_TUTOR_APPOINTMENTS_QUERY, variables: { tutorId } }],
  })

  useEffect(() => {
    if (!tutorLoading && tutorData && !appointmentsLoading && appointmentsData) {
      const slots = computeWorkingSlots(tutorData.tutor.workingHours)
      const filteredSlots = slots.filter((slot) => {
        const slotTime = new Date(slot.fullDate).getTime()
        return !appointmentsData.tutorAppointments.some((app) => {
          const appointmentTime = isNaN(Number(app.date))
            ? new Date(app.date).getTime()
            : Number(app.date)
          return appointmentTime === slotTime
        })
      })
      setAvailableSessions(filteredSlots)
    }
  }, [tutorLoading, tutorData, appointmentsLoading, appointmentsData])

  const handleApplyForSession = async () => {
    if (selectedSession) {
      try {
        setLoading(true)
        await addAppointment({
          variables: {
            tutor: tutorId,
            student: CURRENT_STUDENT_ID,
            date: selectedSession.fullDate,
          },
        })
        setSuccess(true)
        setTimeout(() => {
          router.push("/Landing")
        }, 1500)
      } catch (error) {
        console.error("Error booking appointment:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  if (tutorLoading || appointmentsLoading) return <div><LoadingScreen/></div>

  return (
    <div>
      <NavBar />
      <Container className={styles.container}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={tutorData?.tutor.image}
              alt={tutorData?.tutor.name}
              className={styles.tutorImage}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h3" className={styles.tutorName} gutterBottom>
              {tutorData?.tutor.name}
            </Typography>
            <Typography variant="body1" className={styles.tutorText}>
              Subjects: {tutorData?.tutor.subjects.join(", ")}
            </Typography>
            <Typography variant="body1" className={styles.tutorText}>
              Hourly Rate: ${tutorData?.tutor.hourlyRate}
            </Typography>
            <Typography variant="body1" className={styles.tutorText} gutterBottom>
              Working Hours:
              {tutorData?.tutor.workingHours.map((wh) => (
                <span key={`${wh.day}-${wh.startTime}`}> {wh.day} {wh.startTime}-{wh.endTime} |</span>
              ))}
            </Typography>
            <FormControl fullWidth className={styles.formControl}>
              <InputLabel id="session-label">Available Sessions</InputLabel>
              <Select
                labelId="session-label"
                value={selectedSession ? JSON.stringify(selectedSession) : ""}
                label="Available Sessions"
                onChange={(e) => setSelectedSession(JSON.parse(e.target.value))}
              >
                {availableSessions.map((session) => (
                  <MenuItem key={session.fullDate} value={JSON.stringify(session)}>
                    {session.day} - {session.startTime} to {session.endTime}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApplyForSession}
              className={styles.applyButton}
              disabled={!selectedSession || loading}
              style={{ marginTop: "16px" , padding: "16px 0" }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Apply for Session"}
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={success}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" className={styles.successAlert}>
          Appointment successfully booked!
        </Alert>
      </Snackbar>
      <Footer />
    </div>
  )
}

function computeWorkingSlots(workingHours: WorkingHour[]): Slot[] {
  const slots: Slot[] = []
  workingHours.forEach(({ day, startTime, endTime }) => {
    const startHour = parseInt(startTime.split(":")[0])
    const endHour = parseInt(endTime.split(":")[0])
    for (let hour = startHour; hour < endHour; hour++) {
      const formattedStart = hour.toString().padStart(2, "0") + ":00"
      const formattedEnd = (hour + 1).toString().padStart(2, "0") + ":00"
      const fullDate = getNextDateForDay(day, formattedStart)
      slots.push({ day, startTime: formattedStart, endTime: formattedEnd, fullDate })
    }
  })
  return slots
}

function getNextDateForDay(dayName: string, time: string): string {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = new Date()
  const targetDay = dayNames.indexOf(dayName)
  if (targetDay === -1) return formatLocalISO(today)
  const dayDiff = (targetDay + 7 - today.getDay()) % 7 || 7
  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + dayDiff)
  const [hours, minutes] = time.split(":")
  targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  return formatLocalISO(targetDate)
}

function formatLocalISO(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, "0")
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  const ms = date.getMilliseconds().toString().padStart(3, "0")
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? "+" : "-"
  const absOffset = Math.abs(offsetMinutes)
  const offsetHours = pad(Math.floor(absOffset / 60))
  const offsetMins = pad(absOffset % 60)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}${sign}${offsetHours}:${offsetMins}`
}
