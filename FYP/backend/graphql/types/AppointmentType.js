const { GraphQLObjectType, GraphQLID, GraphQLBoolean, GraphQLString } = require("graphql")
const StudentType = require("./StudentType")
const TutorType = require("./TutorType")

const AppointmentType = new GraphQLObjectType({
  name: "Appointment",
  fields: () => ({
    id: { type: GraphQLID },
    student: { type: StudentType },
    tutor: { type: TutorType },
    date: { type: GraphQLString },
    confirmed: { type: GraphQLBoolean }
  })
})

module.exports = AppointmentType
