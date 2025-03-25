const Tutor = require("../../models/Tutor")
const TutorType = require("../types/TutorType")
const { protect } = require("../../middleware/authMiddleware")
const generateToken = require("../../config/generateTokens")
const { GraphQLList, GraphQLID, GraphQLString, GraphQLFloat } = require("graphql")

const TutorQueries = {
  tutors: {
  // query {
  //   tutors {
  //     id
  //     name
  //     email
  //     hourlyRate
  //     subjects
  //   }
  // }
  type: new GraphQLList(TutorType),
    async resolve(_, args, context) {
      // Use the protect middleware to authenticate the request
      await protect(context)
      return await Tutor.find()
    }
  },
  // query {
  //   tutor(id: "67e157db2c8660f2a4976b59") {
  //     id
  //     name
  //     email
  //     hourlyRate
  //     subjects
  //   }
  // }  
  tutor: {
    type: TutorType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      // Use the protect middleware to authenticate the request
      await protect(context)
      const tutor = await Tutor.findById(args.id)
      if (!tutor) {
        throw new Error("Tutor not found")
      }
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
  //   ) {
  //     id
  //     name
  //     email
  //     hourlyRate
  //     subjects
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
  },
  deleteTutor: {
  // mutation {
  //   deleteTutor(id: "67e157db2c8660f2a4976b59") {
  //     id
  //     name
  //   }
  // }    
    type: TutorType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      // Use the protect middleware to authenticate the request
      await protect(context)
      return Tutor.findByIdAndDelete(args.id)
    }
  }
}

module.exports = { TutorQueries, TutorMutations }
