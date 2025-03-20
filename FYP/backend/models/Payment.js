const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  paymentDate: { type: Date }
})

module.exports = mongoose.model("Payment", paymentSchema)
