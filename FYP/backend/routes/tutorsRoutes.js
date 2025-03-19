const express = require("express")
const router = express.Router()
const {getTutors, setTutors, updateTutors, deleteTutors} = require("../controllers/tutorsController")

router.route("/").get(getTutors).post(setTutors)
router.route("/:id").put(updateTutors).delete(deleteTutors)

module.exports = router
