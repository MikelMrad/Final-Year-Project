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
  CircularProgress
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import { REGISTER_STUDENT_MUTATION, GET_SUBJECTS_QUERY } from "@/data/queries"

interface Subject {
  id: string
  name: string
}

interface StudentRegisterResponse {
  registerStudent: {
    id: string
    name: string
    email: string
    weakPoints: string[]
    image: string
    token: string
  }
}

interface StudentRegisterVariables {
  name: string
  email: string
  password: string
  weakPoints: string[]
  image?: string
}

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export default function RegisterStudentPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [image, setImage] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [selectedWeakPoints, setSelectedWeakPoints] = useState<Subject[]>([])
  const [error, setError] = useState("")

  const { data: subjectsData, loading: subjectsLoading } = useQuery<{ subjects: Subject[] }>(GET_SUBJECTS_QUERY)
  const [registerStudent, { loading }] = useMutation<StudentRegisterResponse, StudentRegisterVariables>(REGISTER_STUDENT_MUTATION)

  // Helper to validate email
  const isValidEmail = (email: string): boolean => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return regex.test(email)
  }

  // Helper to validate password (length > 8 and at least one uppercase letter)
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

    if (!name || !email || !password) {
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

    const weakPoints = selectedWeakPoints.map(s => s.name)
    
    try {
      const { data } = await registerStudent({
        variables: {
          name,
          email: email.toLowerCase(),
          password,
          weakPoints,
          image: imageURL || (image !== "" ? image : undefined),
        },
      })

      if (data?.registerStudent) {
        dispatch(setUser({
          name: data.registerStudent.name,
          email: data.registerStudent.email,
          type: "student",
          token: data.registerStudent.token,
          image: data.registerStudent.image,
          id: data.registerStudent.id,
        }))
        localStorage.setItem("token", data.registerStudent.token)
        router.push("/StudentLogin")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Registration failed")
    }
  }

  const subjectOptions = subjectsData?.subjects
    .filter(subject => !selectedWeakPoints.find(sel => sel.name === subject.name))
    .map(subject => ({ id: subject.id, name: subject.name })) || []

  return (
    <div>
      <NavBar />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register as a Student
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
              value={selectedWeakPoints}
              onChange={(_, newValue) => setSelectedWeakPoints(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Weak Points" variant="outlined" />}
            />
          )}

          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
