const Tutor = require("../../models/Tutor")
const TutorType = require("../types/TutorType")
const { protect } = require("../../middleware/authMiddleware")
const { adminProtect } = require("../../middleware/adminAuthMiddleware")
const generateToken = require("../../config/generateTokens")
const {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt
} = require("graphql")

const InputWorkingHoursType = new GraphQLInputObjectType({
  name: "InputWorkingHours",
  fields: {
    day: { type: GraphQLString },
    startTime: { type: GraphQLString },
    endTime: { type: GraphQLString }
  }
})

const Appointment = require("../../models/Appointment")

function calculateMedian(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  const sorted = [...ratings].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

const TutorQueries = {
  tutors: {
    type: new GraphQLList(TutorType),
    async resolve(_, args, context) {
      await protect(context)
      return await Tutor.find()
    }
  },
  tutor: {
    type: TutorType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await protect(context)
      const tutor = await Tutor.findById(args.id)
      if (!tutor) throw new Error("Tutor not found")
      return tutor
    },
  },
  tutorMedianRating: {
    type: GraphQLFloat,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await protect(context);
      const tutor = await Tutor.findById(args.id)
      if (!tutor) throw new Error("Tutor not found")
      return calculateMedian(tutor.ratings)
    },
  },
}

const TutorMutations = {
  addTutor: {
    type: TutorType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      hourlyRate: { type: GraphQLFloat },
      subjects: { type: new GraphQLList(GraphQLString) },
      image: { type: GraphQLString },
      grade: { type: GraphQLInt },
      workingHours: { type: new GraphQLList(InputWorkingHoursType) }
    },
    async resolve(_, args) {
      const existingTutor = await Tutor.findOne({ email: args.email })
      if (existingTutor) {
        throw new Error("Tutor with this email already exists")
      }
      const tutor = new Tutor({
        name: args.name,
        email: args.email,
        password: args.password,
        hourlyRate: args.hourlyRate,
        subjects: args.subjects,
        image: args.image,
        grade: args.grade,
        workingHours: args.workingHours
      })
      const savedTutor = await tutor.save()
      const token = generateToken(savedTutor.id)
      return {
        ...savedTutor._doc,
        id: savedTutor.id,
        token
      }
    }
  },
  updateTutor: {
    type: TutorType,
    args: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      hourlyRate: { type: GraphQLFloat },
      subjects: { type: new GraphQLList(GraphQLString) },
      image: { type: GraphQLString },
      grade: { type: GraphQLInt },
      workingHours: { type: new GraphQLList(InputWorkingHoursType) }
    },
    async resolve(_, args, context) {
      await protect(context)

      const updateFields = {}

      if (args.name !== undefined) updateFields.name = args.name
      if (args.email !== undefined) updateFields.email = args.email
      if (args.password !== undefined) {
        updateFields.password = await require("bcryptjs").hash(args.password, 10)
      }
      if (args.hourlyRate !== undefined) updateFields.hourlyRate = args.hourlyRate
      if (args.subjects !== undefined) updateFields.subjects = args.subjects
      if (args.image !== undefined) updateFields.image = args.image
      if (args.grade !== undefined) updateFields.grade = args.grade
      if (args.workingHours !== undefined) {
        args.workingHours.forEach(entry => {
          if (!entry.day || !entry.startTime || !entry.endTime) {
            throw new Error("Each working hour entry must include day, startTime, and endTime.")
          }
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
          if (!timeRegex.test(entry.startTime) || !timeRegex.test(entry.endTime)) {
            throw new Error(`Invalid time format: ${entry.startTime} - ${entry.endTime}. Use HH:MM format (00:00 - 23:59).`)
          }
        })
        updateFields.workingHours = args.workingHours
      }

      const updatedTutor = await Tutor.findByIdAndUpdate(args.id, updateFields, { new: true })
      if (!updatedTutor) throw new Error("Tutor not found")
      return updatedTutor
    }
  },
  deleteTutor: {
    type: TutorType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await adminProtect(context)
      const deletedTutor = await Tutor.findByIdAndDelete(args.id)
      if (!deletedTutor) throw new Error("Tutor not found")
      await Appointment.deleteMany({ tutor: args.id })
      return deletedTutor
    }
  },
  rateTutor: {
    type: TutorType,
    args: {
      id: { type: GraphQLID },
      rating: { type: GraphQLInt },
      studentId: { type: GraphQLID },
    },
    async resolve(_, args, context) {
      await protect(context);

      const { id: tutorId, rating, studentId } = args;

      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      // Check confirmed appointments between the student and tutor
      const confirmedAppointments = await Appointment.find({
        tutor: tutorId,
        student: studentId,
        confirmed: true,
        date: { $lt: new Date() }, 
      })

      if (!confirmedAppointments || confirmedAppointments.length === 0) {
        throw new Error("You can only rate a tutor after confirmed appointments have passed.")
      }

      const tutor = await Tutor.findById(tutorId)
      if (!tutor) throw new Error("Tutor not found")

      const studentRatingsCount = tutor.ratings.filter((r) => r.studentId.toString() === studentId).length

      if (studentRatingsCount >= confirmedAppointments.length) {
        throw new Error("You have already rated this tutor for all your confirmed appointments.")
      }

      tutor.ratings.push({ studentId, rating })
      await tutor.save()

      return tutor
    },
  }
}

module.exports = { TutorQueries, TutorMutations }
