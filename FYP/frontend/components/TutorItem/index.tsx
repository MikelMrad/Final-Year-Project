"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardMedia } from "@mui/material"
import { useDispatch } from "react-redux"
import { setFilterProduct } from "@/redux/features/productSlice"
import styles from "./style.module.css"

interface WorkingHour {
  day: string
  startTime: string
  endTime: string
}

interface TutorItemProps {
  id: string
  name: string
  hourlyRate: number
  image: string
  workingHours: WorkingHour[]
  subjects: string[]
}

export default function TutorItem({ id, name, hourlyRate, image, workingHours, subjects }: TutorItemProps) {
  const dispatch = useDispatch()
  const router = useRouter()

  const availability =
    workingHours && workingHours.length > 0
      ? workingHours.map(wh => `${wh.day}: ${wh.startTime}-${wh.endTime}`).join(", ")
      : "N/A"

  const handleClick = () => {
    dispatch(setFilterProduct(id))
    router.push(`/TutorPage/${id}`)
  }

  return (
    <div className={styles.container}>
      <div onClick={handleClick}>
        <Card className={styles.card}>
          <CardHeader title={name} />
          <CardMedia
            component="img"
            alt="Tutor Image"
            image={image}
            className={styles.cardMedia}
          />
          <CardContent>
            <p>Subjects: {subjects.join(", ")}</p>
            <p>Hourly Rate: {hourlyRate}$</p>
            <p>{availability}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
