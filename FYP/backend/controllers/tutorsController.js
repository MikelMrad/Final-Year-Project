const asyncHandler = require("express-async-handler");
//@desc Gets tutors
//@route GET /api/tutors
//@access Private
const getTutors = asyncHandler (async (req , res) => {
  res.status(200).json({ message: "Get Tutors" })
})

//@desc Sets tutors
//@route POST /api/tutors
//@access Private
const setTutors = asyncHandler (async (req , res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error("Please add a text field")
  }
  res.status(200).json({ message: "Create Tutor" })
})

//@desc Updates tutors
//@route PUT /api/tutors/:id
//@access Private
const updateTutors = asyncHandler (async (req , res) => {
  res.status(200).json({ message: `Update Tutor ${req.params.id}` })
})

//@desc Deletes tutors
//@route DELETE /api/tutors/:id
//@access Private
const deleteTutors = asyncHandler (async (req , res) => {
  res.status(200).json({ message: `Delete Tutor ${req.params.id}` }) 
})


module.exports = {
  getTutors,
  setTutors,
  updateTutors,
  deleteTutors
} 