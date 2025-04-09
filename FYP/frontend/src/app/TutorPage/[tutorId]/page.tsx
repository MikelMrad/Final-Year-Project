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
  Grid2
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

interface Slot {
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
console.log("Appointments Data:", appointmentsData)
  const [addAppointment] = useMutation(ADD_APPOINTMENT_MUTATION)

  useEffect(() => {
    if (!tutorLoading && !appointmentsLoading && tutorData) {
      const workingSlots = computeWorkingSlots(tutorData.tutor.workingHours)
      const takenSlots = appointmentsData?.tutorAppointments.map((a) => new Date(a.date).getTime()) || []

      const freeSlots = workingSlots.filter(
        (slot) => !takenSlots.includes(new Date(slot.fullDate).getTime())
      )

      setAvailableSessions(freeSlots)
    }
  }, [tutorLoading, appointmentsLoading, tutorData, appointmentsData])

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

  if (tutorLoading || appointmentsLoading) return <div>Loading...</div>

  return (
    <div>
      <NavBar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} md={4}>
            <img src={tutorData.tutor.image} alt={tutorData.tutor.name} style={{ width: "100%" }} />
          </Grid2>
          <Grid2 item xs={12} md={8}>
            <Typography variant="h4">{tutorData.tutor.name}</Typography>
            <Typography variant="body1">
              Subjects: {tutorData.tutor.subjects.join(", ")}
            </Typography>
            <Typography variant="body1">Hourly Rate: ${tutorData.tutor.hourlyRate}</Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="session-label">Available Sessions</InputLabel>
              <Select
                labelId="session-label"
                value={selectedSession ? JSON.stringify(selectedSession) : ""}
                label="Available Sessions"
                onChange={(e) => setSelectedSession(JSON.parse(e.target.value))}
              >
                {computeWorkingSlots(tutorData.tutor.workingHours).map((session) => {
                  const isTaken = appointmentsData?.tutorAppointments.some(
                    (a) => new Date(a.date).getTime() === new Date(session.fullDate).getTime()
                  )
                  return (
                    <MenuItem
                      key={session.fullDate}
                      value={JSON.stringify(session)}
                      disabled={isTaken}
                    >
                      {session.day} - {session.startTime} to {session.endTime}
                      {isTaken && " (Taken)"}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleApplyForSession}
              disabled={!selectedSession || loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Apply for session"}
            </Button>
          </Grid2>
        </Grid2>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
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
  if (targetDay === -1) return today.toISOString()
  const dayDiff = (targetDay + 7 - today.getDay()) % 7 || 7
  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + dayDiff)
  const [hours, minutes] = time.split(":")
  targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

  return targetDate.toISOString() // UTC time
}
