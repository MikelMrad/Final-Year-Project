const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } = require("graphql")
const AppointmentType = require("./AppointmentType")
const Appointment = require("../../models/Appointment")

const StudentType = new GraphQLObjectType({
  name: "Student",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    weakPoints: { type: new GraphQLList(GraphQLString) },
    image: { type: GraphQLString },
    grade: { type: GraphQLInt },
    token: { type: GraphQLString },
    appointments: {
      type: new GraphQLList(AppointmentType),
      resolve(parent) {
        return Appointment.find({ student: parent._id }).populate("tutor")
      }
    }
  })
})

module.exports = StudentType
