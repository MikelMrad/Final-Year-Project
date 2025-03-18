const express = require("express");
const dotenv = require("dotenv").config()
const port = process.env.PORT || 5000

const app = express()

app.get("/api/tutors", (req, res) => {
  res.send("rez bhalib")
})

app.listen(port, () => console.log(`Server started on ${port}`))
