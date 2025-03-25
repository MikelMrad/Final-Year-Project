const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql")

const SubjectType = new GraphQLObjectType({
  name: "Subject",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString }
  })
})

module.exports = SubjectType
