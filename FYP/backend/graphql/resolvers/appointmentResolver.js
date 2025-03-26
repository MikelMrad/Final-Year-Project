const Appointment = require("../../models/Appointment")
const AppointmentType = require("../types/AppointmentType")
const { GraphQLList, GraphQLID, GraphQLString } = require("graphql")

const AppointmentQueries = {
  appointments: {
    type: new GraphQLList(AppointmentType),
    resolve() {
      return Appointment.find().populate("student tutor")
    }
  },
  appointment: {
    type: AppointmentType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Appointment.findById(args.id).populate("student tutor")
    }
  }
}

const AppointmentMutations = {
  addAppointment: {
    type: AppointmentType,
    args: {
      student: { type: GraphQLID },
      tutor: { type: GraphQLID },
      date: { type: GraphQLString }
    },
    resolve(_, args) {
      const appointment = new Appointment({
        student: args.student,
        tutor: args.tutor,
        date: args.date,
        confirmed: false
      })
      return appointment.save()
    }
  },
  confirmAppointment: {
    type: AppointmentType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await adminProtect(context)
      return await Appointment.findByIdAndUpdate(args.id, { confirmed: true }, { new: true })
    }
  },
  deleteAppointment: {
    type: AppointmentType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await adminProtect(context)
      return await Appointment.findByIdAndDelete(args.id)
    }
  }
}

module.exports = { AppointmentQueries, AppointmentMutations }
