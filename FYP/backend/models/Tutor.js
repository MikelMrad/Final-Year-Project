const mongoose = require('mongoose')

const tutor = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  expertise: {
    type: [String],
    required: true
  },
  experience: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Tutor', tutor)
