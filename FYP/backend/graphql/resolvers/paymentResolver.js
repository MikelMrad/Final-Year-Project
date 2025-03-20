const Payment = require("../../models/Payment")
const PaymentType = require("../types/PaymentType")
const { GraphQLList, GraphQLID, GraphQLFloat, GraphQLString } = require("graphql")

const PaymentQueries = {
  payments: {
    type: new GraphQLList(PaymentType),
    resolve() {
      return Payment.find().populate("student tutor")
    }
  },
  payment: {
    type: PaymentType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Payment.findById(args.id).populate("student tutor")
    }
  }
}

const PaymentMutations = {
  addPayment: {
    type: PaymentType,
    args: {
      student: { type: GraphQLID },
      tutor: { type: GraphQLID },
      amount: { type: GraphQLFloat },
      paymentDate: { type: GraphQLString }
    },
    resolve(_, args) {
      const payment = new Payment({
        student: args.student,
        tutor: args.tutor,
        amount: args.amount,
        paymentDate: args.paymentDate,
        status: "pending"
      })
      return payment.save()
    }
  },
  updatePaymentStatus: {
    type: PaymentType,
    args: {
      id: { type: GraphQLID },
      status: { type: GraphQLString }
    },
    resolve(_, args) {
      return Payment.findByIdAndUpdate(args.id, { status: args.status }, { new: true })
    }
  }
}

module.exports = { PaymentQueries, PaymentMutations }
