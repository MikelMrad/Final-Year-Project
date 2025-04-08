"use client"
import React from "react"
import styles from "./style.module.css"
import { Card, CardContent, CardHeader, CardMedia } from "@mui/material"
import { useDispatch } from "react-redux"
import { addItem } from "../../src/redux/features/cartSlice"
import { setFilterProduct } from "@/redux/features/productSlice"

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
  subjects: string[]  // Added subjects as an array of strings
}

export default function TutorItem({ id, name, hourlyRate, image, workingHours, subjects }: TutorItemProps) {
  console.log("TutorItem props:", { id, name, hourlyRate, image, workingHours, subjects })
  const dispatch = useDispatch()

  // Derive a simple availability string from workingHours
  const availability =
    workingHours && workingHours.length > 0
      ? workingHours.map(wh => `${wh.day}: ${wh.startTime}-${wh.endTime}`).join(", ")
      : "N/A"

  const handleAddToCart = () => {
    // Example action; adjust as needed for your use case
    dispatch(addItem({ id, availableQuantity: 1, name, quantity: 1, image, price: hourlyRate }))
  }

  const handleFilterChange = (product: string) => {
    dispatch(setFilterProduct(product))
  }

  return (
    <div className={styles.container}>
      <a href="/Product" onClick={() => handleFilterChange(id)}>
        <Card className={styles.card} key={id}>
          <CardHeader title={name} />
          <CardMedia
            component="img"
            alt="Tutor Image"
            image={image}
            height={300}
          />
          <CardContent>
            {/* Display subjects list separated by commas */}
            <p>Subjects: {subjects?.join(", ")}</p>
            <p>Hourly Rate: {hourlyRate}$</p>
            <p>Availability: {availability}</p>
            <div className={styles.cardContent}>
              <button onClick={(e) => { e.preventDefault(); handleAddToCart() }}>
                Add To Cart
              </button>
            </div>
          </CardContent>
        </Card>
      </a>
    </div>
  )
}
