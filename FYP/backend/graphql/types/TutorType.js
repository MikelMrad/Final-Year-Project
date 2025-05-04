const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat, GraphQLInt } = require("graphql")
const AppointmentType = require("./AppointmentType")
const Appointment = require("../../models/Appointment")

const WorkingHoursType = new GraphQLObjectType({
  name: "WorkingHours",
  fields: () => ({
    day: { type: GraphQLString },
    startTime: { type: GraphQLString },
    endTime: { type: GraphQLString }
  })
})

const TutorType = new GraphQLObjectType({
  name: "Tutor",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    hourlyRate: { type: GraphQLFloat }, 
    subjects: { type: new GraphQLList(GraphQLString) },
    image: { type: GraphQLString },
    grade: { type: GraphQLInt },
    workingHours: { type: new GraphQLList(WorkingHoursType) },
    appointments: {
      type: new GraphQLList(AppointmentType),
      resolve(parent) {
        return Appointment.find({ tutor: parent._id }).populate("student")
      }
    },
    token: { type: GraphQLString }
  })
})

module.exports = TutorType
