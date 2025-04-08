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
  Grid2,
  MenuItem,
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
  const [error, setError] = useState("")

  const { data: subjectsData, loading: subjectsLoading } = useQuery<{ subjects: Subject[] }>(GET_SUBJECTS_QUERY)
  const [registerTutor, { loading }] = useMutation<TutorRegisterResponse, TutorRegisterVariables>(REGISTER_TUTOR_MUTATION)

  const addWorkingHour = () => {
    setWorkingHours([...workingHours, { day: "", startTime: "", endTime: "" }])
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
    const [startHour, startMinute] = start.split(":").map(Number)
    const [endHour, endMinute] = end.split(":").map(Number)
    const startTotal = startHour * 60 + startMinute
    const endTotal = endHour * 60 + endMinute
    return endTotal > startTotal
  }

  const isValidEmail = (email: string): boolean => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  }  

  const isValidPassword = (password: string): boolean => {
    return password.length > 8 && /[A-Z]/.test(password)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await convertToBase64(e.target.files[0])
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
      const wh = workingHours[i]
      if (!wh.day || !wh.startTime || !wh.endTime) {
        setError(`Please fill in all fields for working hour entry ${i + 1}`)
        return
      }
      if (!isValidTimeRange(wh.startTime, wh.endTime)) {
        setError(`Working hour ${i + 1}: End time must be after start time.`)
        return
      }
    }

    const parsedHourlyRate = parseFloat(hourlyRate)
    const subjectNames = selectedSubjects.map((s) => s.name)

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
        },
      })

      if (data?.registerTutor) {
        dispatch(
          setUser({
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
    .filter(subject => !selectedSubjects.find(sel => sel.name === subject.name))
    .map(subject => ({ id: subject.id, name: subject.name })) || []

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
          <TextField label="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} />

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
              onChange={(_, newValue) => setSelectedSubjects(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Subjects" variant="outlined" />}
            />
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Working Hours</Typography>
            {workingHours.map((wh, index) => (
              <Grid2 container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                <Grid2 item xs={3}>
                  <TextField
                    select
                    fullWidth
                    label="Day *"
                    value={wh.day}
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
                    value={wh.startTime}
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
                    value={wh.endTime}
                    onChange={(e) => updateWorkingHour(index, "endTime", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid2>
                <Grid2 item xs={3}>
                  <Button variant="outlined" color="error" onClick={() => removeWorkingHour(index)} fullWidth>
                    REMOVE
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
