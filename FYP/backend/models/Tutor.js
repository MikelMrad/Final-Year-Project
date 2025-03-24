const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const TutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  subjects: [{ type: String }]
})

TutorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})


TutorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('Tutor', TutorSchema)

