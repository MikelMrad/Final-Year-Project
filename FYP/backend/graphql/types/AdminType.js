const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql")

const AdminType = new GraphQLObjectType({
  name: "Admin",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    image: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
})

module.exports = AdminType
