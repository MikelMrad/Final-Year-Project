import dotenv from "dotenv";
dotenv.config()

import express from "express"
import { connectDatabase } from "./config/database.js"

const app = express()

app.get("/products", (req, res) => {})

app.listen(3000, () => {
  connectDatabase();
  console.log("Server started at http://localhost:3000");
})

