const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLInt } = require("graphql")

const ExpenseType = new GraphQLObjectType({
  name: "Expense",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    date: {
      type: GraphQLString,
      resolve(expense) {
        return expense.date instanceof Date
          ? expense.date.toISOString()
          : new Date(expense.date).toISOString()
      },
    },
    count: { type: GraphQLInt },
  }),
})

module.exports = ExpenseType;