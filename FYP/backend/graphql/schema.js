const { AuthResolvers } = require("./resolvers/authResolver")
const { GraphQLSchema, GraphQLObjectType } = require("graphql")
const { TutorQueries, TutorMutations } = require("./resolvers/tutorResolver")
const { AdminMutations, AdminQueries } = require("./resolvers/adminResolver")
const { ReviewQueries, ReviewMutations } = require("./resolvers/reviewResolver")
const { StudentQueries, StudentMutations } = require("./resolvers/studentResolver")
const { PaymentQueries, PaymentMutations } = require("./resolvers/paymentResolver")
const { SubjectQueries, SubjectMutations } = require("./resolvers/subjectResolver")
const { AppointmentQueries, AppointmentMutations } = require("./resolvers/appointmentResolver")
const { NotificationQueries, NotificationMutations } = require("./resolvers/notificationResolver")

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...AdminQueries, 
    ...TutorQueries,
    ...ReviewQueries,
    ...StudentQueries,
    ...PaymentQueries,
    ...SubjectQueries,
    ...AppointmentQueries,
    ...NotificationQueries
  }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...AuthResolvers,
    ...AdminMutations,
    ...TutorMutations,
    ...ReviewMutations,
    ...SubjectMutations,
    ...PaymentMutations,
    ...StudentMutations,
    ...AppointmentMutations,
    ...NotificationMutations,
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
