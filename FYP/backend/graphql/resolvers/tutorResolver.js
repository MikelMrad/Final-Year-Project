const Tutor = require("../../models/Tutor")
const TutorType = require("../types/TutorType")
const { protect } = require("../../middleware/authMiddleware")
const generateToken = require("../../config/generateTokens")
const { GraphQLList, GraphQLID, GraphQLString, GraphQLFloat } = require("graphql")

const TutorQueries = {
  tutors: {
    type: new GraphQLList(TutorType),
    async resolve() {
      return await Tutor.find()
    }
  },
  tutor: {
    type: TutorType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context ) {
      await protect(context)
      return await Tutor.findById(args.id)
    }
  }
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
      token: { type: GraphQLString },
    },
    async resolve(_, args) {
      try {
        const existingTutor = await Tutor.findOne({ email: args.email })
        if (existingTutor) {
          throw new Error("A tutor with this email already exists.")
        }
        const tutor = new Tutor({
          name: args.name,
          email: args.email,
          password: args.password,
          hourlyRate: args.hourlyRate,
          subjects: args.subjects
        })
        const savedTutor = await tutor.save()
        const token = generateToken(savedTutor._id)
        savedTutor.token = token
        return savedTutor
      } catch (error) {
        console.error("Error in addTutor mutation:", error)
        throw new Error("Could not save tutor.")
      }
    }
  }
}

module.exports = { TutorQueries, TutorMutations }
