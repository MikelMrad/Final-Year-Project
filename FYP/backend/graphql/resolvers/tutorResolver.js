const Tutor = require("../../models/Tutor")
const TutorType = require("../types/TutorType")
const { GraphQLList, GraphQLID, GraphQLString, GraphQLFloat, GraphQLList: List } = require("graphql")

const TutorQueries = {
  tutors: {
    type: new GraphQLList(TutorType),
    resolve() {
      return Tutor.find()
    }
  },
  tutor: {
    type: TutorType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Tutor.findById(args.id)
    }
  }
}
//bump
const TutorMutations = {
  addTutor: {
    type: TutorType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      hourlyRate: { type: GraphQLFloat },
      subjects: { type: new GraphQLList(GraphQLString) }
    },
    async resolve(_, args) {
      try {
        const tutor = new Tutor({
          name: args.name,
          email: args.email,
          password: args.password,
          hourlyRate: args.hourlyRate,
          subjects: args.subjects
        })
        console.log("Saving tutor:", tutor)
        const savedTutor = await tutor.save()
        console.log("Saved tutor:", savedTutor)
        return savedTutor
      } catch (error) {
        console.error("Error in addTutor mutation:", error)
        throw new Error("Could not save tutor.")
      }
    }
  },  
  deleteTutor: {
    type: TutorType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Tutor.findByIdAndDelete(args.id)
    }
  }
}

module.exports = { TutorQueries, TutorMutations }
