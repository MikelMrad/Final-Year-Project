const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const TutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  subjects: [{ type: String }],
  image: { type: String, default: "" },
  grade: { type: Number, required: true }, 
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  workingHours: [{
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  }],
  ratings: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      rating: { type: Number, required: true },
    },
  ]
}, { timestamps: true })

TutorSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

TutorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

TutorSchema.virtual("medianRating").get(function() {
  if (!this.ratings || this.ratings.length === 0) return null
  const sortedRatings = [...this.ratings.map(r => r.rating)].sort((a, b) => a - b)
  const mid = Math.floor(sortedRatings.length / 2)
  return sortedRatings.length % 2 !== 0
    ? sortedRatings[mid]
    : (sortedRatings[mid - 1] + sortedRatings[mid]) / 2;
})

module.exports = mongoose.model("Tutor", TutorSchema)
