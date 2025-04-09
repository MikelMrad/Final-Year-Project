const Appointment = require("../../models/Appointment")
const AppointmentType = require("../types/AppointmentType")
const { adminProtect } = require("../../middleware/adminAuthMiddleware")
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
  },
  tutorAppointments: {
    type: new GraphQLList(AppointmentType),
    args: { tutorId: { type: GraphQLID } },
    resolve(_, args) {
      return Appointment.find({ tutor: args.tutorId }).populate("student tutor")
    }
  },
  studentAppointments: {
    type: new GraphQLList(AppointmentType),
    args: { studentId: { type: GraphQLID } },
    resolve(_, args) {
      return Appointment.find({ student: args.studentId }).populate("student tutor")
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
    async resolve(_, args) {
      const { student, tutor, date } = args
      const appointmentDate = new Date(date)
  
      const tutorConflict = await Appointment.findOne({
        tutor,
        date: appointmentDate,
      })
      if (tutorConflict) {
        throw new Error("This tutor already has an appointment at the selected time.")
      }
  
      const studentConflict = await Appointment.findOne({
        student,
        date: appointmentDate,
      })
      if (studentConflict) {
        throw new Error("This student already has an appointment at the selected time.")
      }
  
      const appointment = new Appointment({
        student,
        tutor,
        date: appointmentDate,
        confirmed: false,
      })
  
      const savedAppointment = await appointment.save()
      return savedAppointment
    }
  },
  confirmAppointment: {
    type: AppointmentType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await adminProtect(context)
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        args.id,
        { confirmed: true },
        { new: true }
      ).populate("tutor").populate("student")
      return updatedAppointment
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
