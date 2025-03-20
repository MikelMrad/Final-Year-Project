const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
  rating: { type: Number, required: true },
  comment: { type: String }
})

module.exports = mongoose.model("Review", reviewSchema)
