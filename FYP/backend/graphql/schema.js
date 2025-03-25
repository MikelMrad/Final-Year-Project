const { GraphQLSchema, GraphQLObjectType } = require("graphql")
const { TutorQueries, TutorMutations } = require("./resolvers/tutorResolver")
const { StudentQueries, StudentMutations } = require("./resolvers/studentResolver")
const { AppointmentQueries, AppointmentMutations } = require("./resolvers/appointmentResolver")
const { PaymentQueries, PaymentMutations } = require("./resolvers/paymentResolver")
const { ReviewQueries, ReviewMutations } = require("./resolvers/reviewResolver")
const { NotificationQueries, NotificationMutations } = require("./resolvers/notificationResolver")
const { authResolvers } = require("./resolvers/authResolver");
const { SubjectQueries, SubjectMutations } = require("./resolvers/subjectResolver")

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...TutorQueries,
    ...StudentQueries,
    ...AppointmentQueries,
    ...PaymentQueries,
    ...ReviewQueries,
    ...NotificationQueries,
    ...SubjectQueries
  }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...TutorMutations,
    ...StudentMutations,
    ...AppointmentMutations,
    ...PaymentMutations,
    ...ReviewMutations,
    ...NotificationMutations,
    ...SubjectMutations,
    ...authResolvers
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
