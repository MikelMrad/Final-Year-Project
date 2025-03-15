import dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import { connectDatabase } from "./config/database"

const app = express()

app.get("/products", (req: Request, res: Response) => {
  res.send("Product list")
})

app.listen(3000, () => {
  connectDatabase();
  console.log("Server started at http://localhost:3000")
})
