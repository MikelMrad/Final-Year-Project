import express from "express"
import dotenv from "dotenv"
import { connectDatabase } from "./config/database.js"

dotenv.config()
const app = express()

app.get("/products", (req, res) => {})

app.listen(3000, () => {
  connectDatabase()
  console.log("server started at http://localhost:5600 ")
})
