const mongoose = require("mongoose")

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  subjects: [{ type: String, required: true }]
})

module.exports = mongoose.model("Tutor", tutorSchema)
