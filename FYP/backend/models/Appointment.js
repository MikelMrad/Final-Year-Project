const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
  date: { type: Date, required: true },
  confirmed: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false }
})

module.exports = mongoose.model("Appointment", appointmentSchema)
