const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = require("graphql")
const AppointmentType = require("./AppointmentType")
const Appointment = require("../../models/Appointment")

const StudentType = new GraphQLObjectType({
  name: "Student",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    enrolledCourses: { type: new GraphQLList(GraphQLString) },
    weakPoints: { type: new GraphQLList(GraphQLString) },
    image: { type: GraphQLString },
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
