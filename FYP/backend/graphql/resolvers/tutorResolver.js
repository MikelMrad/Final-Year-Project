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
  GraphQLObjectType,
  GraphQLInputObjectType
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

const TutorQueries = {
  // query {
  //   tutors {
  //     id
  //     name
  //     email
  //     hourlyRate
  //     subjects
  //     image
  //     workingHours {
  //       day
  //       startTime
  //       endTime
  //     }
  //   }
  // }
  tutors: {
    type: new GraphQLList(TutorType),
    async resolve(_, args, context) {
      await protect(context) 
      return await Tutor.find()
    }
  },
  // query {
  //   tutor(id: "TUTOR_ID") {
  //     id
  //     name
  //     email
  //     hourlyRate
  //     subjects
  //     image
  //     workingHours {
  //       day
  //       startTime
  //       endTime
  //     }
  //   }
  // }
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
}

const TutorMutations = {
  // mutation {
  //   addTutor(
  //     name: "John Doe"
  //     email: "johndoe@example.com"
  //     password: "password123"
  //     hourlyRate: 50.0
  //     subjects: ["Math", "Science"]
  //     image: "profile.jpg"
  //     workingHours: [
  //       { day: "Monday", startTime: "09:00", endTime: "17:00" },
  //       { day: "Wednesday", startTime: "10:00", endTime: "16:00" }
  //     ]
  //   ) {
  //     id
  //     name
  //     email
  //     hourlyRate
  //     subjects
  //     image
  //     workingHours {
  //       day
  //       startTime
  //       endTime
  //     }
  //     token
  //   }
  // }
  addTutor: {
    type: TutorType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      hourlyRate: { type: GraphQLFloat },
      subjects: { type: new GraphQLList(GraphQLString) },
      image: { type: GraphQLString },
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
  // mutation {
  //   updateTutor(
  //     id: "TUTOR_ID"
  //     name: "Updated Name"
  //     hourlyRate: 60
  //     subjects: ["English", "Physics"]
  //     image: "new-profile.jpg"
  //   ) {
  //     id
  //     name
  //     email
  //     hourlyRate
  //     subjects
  //     image
  //     workingHours {
  //       day
  //       startTime
  //       endTime
  //     }
  //   }
  // }
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
  // mutation {
  //   deleteTutor(id: "TUTOR_ID") {
  //     id
  //     name
  //   }
  // }
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
  }
}

module.exports = { TutorQueries, TutorMutations }
