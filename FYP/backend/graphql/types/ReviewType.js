const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString } = require("graphql")
const StudentType = require("./StudentType")
const TutorType = require("./TutorType")

const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: { type: GraphQLID },
    student: { type: StudentType },
    tutor: { type: TutorType },
    rating: { type: GraphQLInt },
    comment: { type: GraphQLString }
  })
})

module.exports = ReviewType
