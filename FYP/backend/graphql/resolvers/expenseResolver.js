const Expense = require("../../models/Expense")
const ExpenseType = require("../types/ExpenseType")
const { GraphQLList, GraphQLID, GraphQLString, GraphQLFloat } = require("graphql")

const ExpenseQueries = {
  expenses: {
    type: new GraphQLList(ExpenseType),
    resolve() {
      return Expense.find()
    },
  },
  expense: {
    type: ExpenseType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Expense.findById(args.id)
    },
  },
}

const ExpenseMutations = {
  addExpense: {
    type: ExpenseType,
    args: {
      title: { type: GraphQLString },
      amount: { type: GraphQLFloat },
      date: { type: GraphQLString },
    },
    resolve(_, args) {
      const validDate = args.date ? new Date(args.date) : new Date()

      if (isNaN(validDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const newExpense = new Expense({
        title: args.title,
        amount: args.amount,
        date: validDate,
      })

      return newExpense.save();
    },
  },
  updateExpense: {
    type: ExpenseType,
    args: {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      amount: { type: GraphQLFloat },
      date: { type: GraphQLString },
    },
    resolve(_, args) {
      const validDate = args.date ? new Date(args.date) : new Date()

      if (isNaN(validDate.getTime())) {
        throw new Error("Invalid date format")
      }

      return Expense.findByIdAndUpdate(
        args.id,
        {
          title: args.title,
          amount: args.amount,
          date: validDate,
        },
        { new: true }
      )
    },
  },
  deleteExpense: {
    type: ExpenseType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Expense.findByIdAndDelete(args.id)
    },
  },
}


module.exports = { ExpenseQueries, ExpenseMutations }
