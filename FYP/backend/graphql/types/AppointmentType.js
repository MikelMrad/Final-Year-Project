const { GraphQLObjectType, GraphQLID, GraphQLBoolean, GraphQLString } = require("graphql")

const AppointmentType = new GraphQLObjectType({
  name: "Appointment",
  fields: () => ({
    id: { type: GraphQLID },
    student: { type: require("./StudentType") },
    tutor: { type: require("./TutorType") },
    date: { type: GraphQLString },
    confirmed: { type: GraphQLBoolean },
    isPaid: { type: GraphQLBoolean }
  })
})

module.exports = AppointmentType
