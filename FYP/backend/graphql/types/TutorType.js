const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLList } = require("graphql")

const TutorType = new GraphQLObjectType({
  name: "Tutor",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    hourlyRate: { type: GraphQLFloat },
    subjects: { type: new GraphQLList(GraphQLString) }
  })
})

module.exports = TutorType
