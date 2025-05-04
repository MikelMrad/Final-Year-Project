"use client"
import React, { useState, FormEvent } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { setUser } from "@/redux/features/userSlice"
import NavBar from "../../../modules/NavBar"
import Footer from "../../../modules/Footer"
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  MenuItem,
  Grid as Grid2,
  InputLabel,
  Select,
  FormControl
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import { REGISTER_TUTOR_MUTATION, GET_SUBJECTS_QUERY } from "@/data/queries"

interface Subject {
  id: string
  name: string
}

interface WorkingHour {
  day: string
  startTime: string
  endTime: string
}

interface TutorRegisterResponse {
  registerTutor: {
    id: string
    name: string
    email: string
    hourlyRate: number
    subjects: string[]
    image: string
    workingHours: WorkingHour[]
    grade: number
    token: string
  }
}

interface TutorRegisterVariables {
  name: string
  email: string
  password: string
  hourlyRate: number
  subjects: string[]
  image?: string
  workingHours?: WorkingHour[]
  grade: number
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export default function RegisterTutorPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [image, setImage] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([])
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([])
  const [grade, setGrade] = useState<number>(12) // Default grade is 12
  const [error, setError] = useState("")

  const { data: subjectsData, loading: subjectsLoading } = useQuery<{ subjects: Subject[] }>(GET_SUBJECTS_QUERY)
  const [registerTutor, { loading }] = useMutation<TutorRegisterResponse, TutorRegisterVariables>(REGISTER_TUTOR_MUTATION)

  const addWorkingHour = () => {
    setWorkingHours([...workingHours, { day: "", startTime: "", endTime: "" }])
  }

  const duplicateWorkingHour = (index: number) => {
    const entryToDuplicate = workingHours[index]
    setWorkingHours([...workingHours, { ...entryToDuplicate }])
  }

  const updateWorkingHour = (index: number, field: keyof WorkingHour, value: string) => {
    const updated = [...workingHours]
    updated[index] = { ...updated[index], [field]: value }
    setWorkingHours(updated)
  }

  const removeWorkingHour = (index: number) => {
    const updated = workingHours.filter((_, i) => i !== index)
    setWorkingHours(updated)
  }

  const isValidTimeRange = (start: string, end: string): boolean => {
    const [startHour, startMin] = start.split(":").map(Number)
    const [endHour, endMin] = end.split(":").map(Number)
    const startTotal = startHour * 60 + startMin
    const endTotal = endHour * 60 + endMin
    return endTotal > startTotal
  }

  const isValidEmail = (email: string): boolean => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return regex.test(email)
  }

  const isValidPassword = (password: string): boolean => {
    return password.length > 8 && /[A-Z]/.test(password)
  }

  const timesOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
    const [shA, smA] = startA.split(":").map(Number)
    const [ehA, emA] = endA.split(":").map(Number)
    const [shB, smB] = startB.split(":").map(Number)
    const [ehB, emB] = endB.split(":").map(Number)
    const startAmin = shA * 60 + smA
    const endAmin = ehA * 60 + emA
    const startBmin = shB * 60 + smB
    const endBmin = ehB * 60 + emB
    return startAmin < endBmin && startBmin < endAmin
  }

  const validateWorkingHourCollisions = (): boolean => {
    const groupedByDay: { [day: string]: WorkingHour[] } = {}
    for (let wh of workingHours) {
      if (!groupedByDay[wh.day]) groupedByDay[wh.day] = []
      groupedByDay[wh.day].push(wh)
    }
    for (let day in groupedByDay) {
      const dayHours = groupedByDay[day]
      for (let i = 0; i < dayHours.length; i++) {
        for (let j = i + 1; j < dayHours.length; j++) {
          if (timesOverlap(dayHours[i].startTime, dayHours[i].endTime, dayHours[j].startTime, dayHours[j].endTime)) {
            setError(`Working hour collision on ${day}: ${dayHours[i].startTime}-${dayHours[i].endTime} overlaps with ${dayHours[j].startTime}-${dayHours[j].endTime}`)
            return false
          }
        }
      }
    }
    return true
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!validTypes.includes(file.type)) {
        setError("Only JPG and PNG images are allowed.")
        return
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setError("File size exceeds the 5MB limit.")
        return
      }
      try {
        const base64 = await convertToBase64(file)
        setImageURL(base64)
      } catch (err) {
        console.error("Image conversion failed", err)
        setError("Image upload failed")
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    if (!name || !email || !password || !hourlyRate) {
      setError("Please fill all required fields")
      return
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!isValidPassword(password)) {
      setError("Password must be longer than 8 characters and contain at least one uppercase letter")
      return
    }
    for (let i = 0; i < workingHours.length; i++) {
      const workingHour = workingHours[i]
      if (!workingHour.day || !workingHour.startTime || !workingHour.endTime) {
        setError(`Please fill in all fields for working hour entry ${i + 1}`)
        return
      }
      if (!isValidTimeRange(workingHour.startTime, workingHour.endTime)) {
        setError(`Working hour ${i + 1}: End time must be after start time.`)
        return
      }
    }
    if (!validateWorkingHourCollisions()) return
    const parsedHourlyRate = parseFloat(hourlyRate)
    const subjectNames = selectedSubjects.map(s => s.name)
    try {
      const { data } = await registerTutor({
        variables: {
          name,
          email: email.toLowerCase(),
          password,
          hourlyRate: parsedHourlyRate,
          subjects: subjectNames,
          image: imageURL || (image !== "" ? image : undefined),
          workingHours: workingHours.length > 0 ? workingHours : undefined,
          grade // send grade in mutation
        },
      })
      if (data?.registerTutor) {
        dispatch(
          setUser({
            id: data.registerTutor.id,
            name: data.registerTutor.name,
            email: data.registerTutor.email,
            type: "tutor",
            token: data.registerTutor.token,
            image: data.registerTutor.image,
          })
        )
        localStorage.setItem("token", data.registerTutor.token)
        router.push("/TutorLogin")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Registration failed")
    }
  }

  const subjectOptions = subjectsData?.subjects
    .filter((subject) => !selectedSubjects.find((sel) => sel.name === subject.name))
    .map((subject) => ({ id: subject.id, name: subject.name })) || []

  return (
    <div>
      <NavBar />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register as a Tutor
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <TextField label="Hourly Rate" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required />
          
          {/* New grade dropdown */}
          <FormControl fullWidth required>
            <InputLabel id="grade-select-label">Grade</InputLabel>
            <Select
              labelId="grade-select-label"
              value={grade}
              label="Grade"
              onChange={(e) => setGrade(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box>
            <Typography variant="body1">Or Upload an Image:</Typography>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imageURL && (
              <img src={imageURL} alt="Preview" style={{ width: 100, height: 100, objectFit: "cover", marginTop: 8 }} />
            )}
          </Box>
          {subjectsLoading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          ) : (
            <Autocomplete
              multiple
              options={subjectOptions}
              getOptionLabel={(option) => option.name}
              value={selectedSubjects}
              onChange={(_, newValue: Subject[]) => setSelectedSubjects(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Subjects" variant="outlined" />}
            />
          )}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Working Hours</Typography>
            {workingHours.map((workingHour, index) => (
              <Grid2 container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                <Grid2 item xs={3}>
                  <TextField
                    select
                    fullWidth
                    label="Day *"
                    value={workingHour.day}
                    onChange={(e) => updateWorkingHour(index, "day", e.target.value)}
                    required
                  >
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid2>
                <Grid2 item xs={3}>
                  <TextField
                    fullWidth
                    label="Start Time *"
                    type="time"
                    value={workingHour.startTime}
                    onChange={(e) => updateWorkingHour(index, "startTime", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid2>
                <Grid2 item xs={3}>
                  <TextField
                    fullWidth
                    label="End Time *"
                    type="time"
                    value={workingHour.endTime}
                    onChange={(e) => updateWorkingHour(index, "endTime", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid2>
                <Grid2 item xs={3} sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outlined" color="error" onClick={() => removeWorkingHour(index)} fullWidth>
                    REMOVE
                  </Button>
                  <Button variant="outlined" onClick={() => duplicateWorkingHour(index)} fullWidth>
                    DUPLICATE
                  </Button>
                </Grid2>
              </Grid2>
            ))}
            <Button variant="contained" onClick={addWorkingHour} sx={{ mt: 1 }}>
              ADD WORKING HOUR
            </Button>
          </Box>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
