const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  enrolledCourses: [{ type: String }],
  weakPoints: [{ type: String }],
  image: { type: String, default: "default-avatar.png" },
}, { timestamps: true })

StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

StudentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("Student", StudentSchema)

