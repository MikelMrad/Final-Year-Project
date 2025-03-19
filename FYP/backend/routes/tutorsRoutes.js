const express = require('express')
const router = express.Router()
const Tutor = require('../models/Tutor')

router.post('/', async (req, res) => {
  try {
    const { name, email, hourlyRate, expertise, experience } = req.body
    const tutor = new Tutor({ name, email, hourlyRate, expertise, experience })
    await tutor.save()
    res.status(201).json(tutor)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const tutors = await Tutor.find()
    res.json(tutors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id)
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' })
    res.json(tutor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
