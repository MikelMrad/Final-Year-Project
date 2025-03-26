const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const TutorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  hourlyRate: Number,
  subjects: [String],
  image: { type: String, default: "default-avatar.png" },
  workingHours: [
    {
      day: String, // e.g., "Monday", "Tuesday"
      startTime: String, // e.g., "09:00"
      endTime: String // e.g., "17:00"
    }
  ]
}, { timestamps: true })

TutorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})


TutorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('Tutor', TutorSchema)

