const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat } = require("graphql")

const WorkingHoursType = new GraphQLObjectType({
  name: "WorkingHours",
  fields: () => ({
    day: { type: GraphQLString },
    startTime: { type: GraphQLString },
    endTime: { type: GraphQLString }
  })
})

const TutorType = new GraphQLObjectType({
  name: "Tutor",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    hourlyRate: { type: GraphQLFloat }, 
    subjects: { type: new GraphQLList(GraphQLString) },
    image: { type: GraphQLString },
    workingHours: { type: new GraphQLList(WorkingHoursType) },
    token: { type: GraphQLString }
  })
})

module.exports = TutorType
