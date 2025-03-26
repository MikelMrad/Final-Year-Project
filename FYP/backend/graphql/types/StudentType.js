const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = require("graphql")

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
  })
})

module.exports = StudentType
