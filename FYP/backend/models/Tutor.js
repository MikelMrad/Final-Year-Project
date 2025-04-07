const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const TutorSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
    trim: true,
  },
  password: String,
  hourlyRate: Number,
  subjects: [String],
  image: { type: String, default: "default-avatar.png" },
  workingHours: [
    {
      day: String,
      startTime: String,
      endTime: String
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

