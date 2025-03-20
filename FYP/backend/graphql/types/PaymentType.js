const { GraphQLObjectType, GraphQLID, GraphQLFloat, GraphQLString } = require("graphql")
const StudentType = require("./StudentType")
const TutorType = require("./TutorType")

const PaymentType = new GraphQLObjectType({
  name: "Payment",
  fields: () => ({
    id: { type: GraphQLID },
    student: { type: StudentType },
    tutor: { type: TutorType },
    amount: { type: GraphQLFloat },
    status: { type: GraphQLString },
    paymentDate: { type: GraphQLString }
  })
})

module.exports = PaymentType
