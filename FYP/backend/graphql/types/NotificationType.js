const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = require("graphql")
const StudentType = require("./StudentType")

const NotificationType = new GraphQLObjectType({
  name: "Notification",
  fields: () => ({
    id: { type: GraphQLID },
    recipient: { type: StudentType },
    message: { type: GraphQLString },
    read: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString }
  })
})

module.exports = NotificationType
