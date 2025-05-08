'use client'
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
  RATE_TUTOR_MUTATION,
  GET_TUTOR_MEDIAN_RATING_QUERY,
} from "@/data/queries"
import NavBar from "../../../../modules/NavBar"
import Footer from "../../../../modules/Footer"
import { useAppSelector } from "@/redux/store"
import styles from "../style.module.css"
import LoadingScreen from "../../../../components/LoadingScreen/page"
import StarIcon from "@mui/icons-material/Star"
import Rating from "@mui/material/Rating"

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
  medianRating?: number
}

interface TutorData {
  tutor: Tutor
}

interface Appointment {
  id: string
  date: string
  confirmed: boolean
  isPaid?: boolean
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

  const [availableSessions, setAvailableSessions] = useState<Slot[]>([]);
  const [selectedSession, setSelectedSession] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const { data: tutorData, loading: tutorLoading } = useQuery<TutorData>(GET_TUTOR_QUERY, {
    variables: { id: tutorId },
  })

  const { data: appointmentsData, loading: appointmentsLoading } = useQuery<AppointmentsData>(
    GET_TUTOR_APPOINTMENTS_QUERY,
    { variables: { tutorId } }
  )

  const { data: medianRatingData, loading: medianRatingLoading } = useQuery(
    GET_TUTOR_MEDIAN_RATING_QUERY,
    { variables: { id: tutorId } }
  )

  const [addAppointment] = useMutation(ADD_APPOINTMENT_MUTATION, {
    refetchQueries: [
      { query: GET_TUTOR_APPOINTMENTS_QUERY, variables: { tutorId } }
    ],
  })

  const [rateTutor] = useMutation(RATE_TUTOR_MUTATION, {
    refetchQueries: [
      { query: GET_TUTOR_MEDIAN_RATING_QUERY, variables: { id: tutorId } },
      { query: GET_TUTOR_APPOINTMENTS_QUERY,   variables: { tutorId } }
    ],
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
            tutor:   tutorId,
            student: CURRENT_STUDENT_ID,
            date:    new Date(selectedSession.fullDate).toISOString(),
          },
        })
        setSuccess(true);
        setTimeout(() => {
          router.push("/Landing");
        }, 1500)
      } catch (error) {
        console.error("Error booking appointment:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRateTutor = async (newRating: number) => {
    try {
      await rateTutor({
        variables: {
          id:        tutorId,
          rating:    newRating,
          studentId: CURRENT_STUDENT_ID,
        },
      })
      setRating(newRating)
      setSnackbarMessage("Thank you for rating the tutor!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true);
    } catch (error: any) {
      console.error("Error rating tutor:", error)
      setSnackbarMessage(error.message || "Failed to submit rating. Please try again.");
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  if (tutorLoading || appointmentsLoading || medianRatingLoading) {
    return <LoadingScreen />;
  }

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
              Hourly Rate: ${tutorData?.tutor.hourlyRate.toFixed(2)}
            </Typography>
            <Typography variant="body1" className={styles.tutorText}>
              Rating:{" "}
              <Box component="span" display="flex" alignItems="center">
                {medianRatingData?.tutorMedianRating && medianRatingData.tutorMedianRating > 0 ? (
                  <>
                    {Array.from({ length: Math.round(medianRatingData.tutorMedianRating) }).map(
                      (_, i) => <StarIcon key={i} style={{ color: "#FFD700" }} />
                    )}
                    {` (${medianRatingData.tutorMedianRating.toFixed(1)})`}
                  </>
                ) : (
                  " No ratings yet"
                )}
              </Box>
            </Typography>
            <Typography variant="body1" className={styles.tutorText} gutterBottom>
              Working Hours:
              {tutorData?.tutor.workingHours.map((wh) => (
                <span key={`${wh.day}-${wh.startTime}`}>
                  {" "}
                  {wh.day} {wh.startTime}-{wh.endTime} |
                </span>
              ))}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Rate this Tutor:</Typography>
              <Rating
                name="tutor-rating"
                value={rating}
                onChange={(_, newValue) => {
                  if (newValue) handleRateTutor(newValue);
                }}
                max={5}
              />
            </Box>
            <FormControl fullWidth className={styles.formControl}>
              <InputLabel id="session-label">Available Sessions</InputLabel>
              <Select
                labelId="session-label"
                value={selectedSession ? JSON.stringify(selectedSession) : ""}
                label="Available Sessions"
                onChange={(e) => setSelectedSession(JSON.parse(e.target.value as string))}
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
              style={{ marginTop: "16px", padding: "16px 0" }}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 5)
}

function computeWorkingSlots(workingHours: WorkingHour[]): Slot[] {
  const slots: Slot[] = []
  workingHours.forEach(({ day, startTime, endTime }) => {
    const [sh, sm] = startTime.split(":").map(Number)
    const [eh, em] = endTime.split(":").map(Number)
    let current = new Date()
    current.setHours(sh, sm, 0, 0)
    const end = new Date()
    end.setHours(eh, em, 0, 0)

    while (current.getTime() + 60 * 60 * 1000 <= end.getTime()) {
      const start = new Date(current)
      const endSess = new Date(current.getTime() + 60 * 60 * 1000)
      const formattedStart = formatTime(start)
      const formattedEnd = formatTime(endSess)
      const fullDate = getNextDateForDay(day, formattedStart)
      slots.push({ day, startTime: formattedStart, endTime: formattedEnd, fullDate })
      current = endSess
    }
  })
  return slots
}

function getNextDateForDay(dayName: string, time: string): string {
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  const today = new Date()
  const target = dayNames.indexOf(dayName)
  const diff = (target + 7 - today.getDay()) % 7 || 7
  const date = new Date(today)
  date.setDate(today.getDate() + diff)
  const [h, m] = time.split(":").map(Number)
  date.setHours(h, m, 0, 0)
  return date.toISOString()
}
