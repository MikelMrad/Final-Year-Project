const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLID, GraphQLFloat } = require('graphql')
const Tutor = require('../models/Tutor')
const Student = require('../models/Student')
const Appointment = require('../models/Appointment')

const TutorType = new GraphQLObjectType({
  name: 'Tutor',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    hourlyRate: { type: GraphQLFloat },
    expertise: { type: new GraphQLList(GraphQLString) },
    experience: { type: GraphQLInt }
  })
})

const StudentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    courses: { type: new GraphQLList(GraphQLString) },
    weakPoints: { type: new GraphQLList(GraphQLString) }
  })
})

const AppointmentType = new GraphQLObjectType({
  name: 'Appointment',
  fields: () => ({
    id: { type: GraphQLID },
    studentId: { type: GraphQLID },
    tutorId: { type: GraphQLID },
    date: { type: GraphQLString },
    status: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // {
    //   tutors {
    //     id
    //     name
    //     email
    //     hourlyRate
    //     expertise
    //     experience
    //   }
    // }
    tutors: {
      type: new GraphQLList(TutorType),
      resolve(parent, args) {
        return Tutor.find()
      }
    },
    tutor: {
      type: TutorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Tutor.findById(args.id)
      }
    },
    students: {
      type: new GraphQLList(StudentType),
      resolve(parent, args) {
        return Student.find()
      }
    },
    student: {
      type: StudentType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Student.findById(args.id)
      }
    },
    appointments: {
      type: new GraphQLList(AppointmentType),
      resolve(parent, args) {
        return Appointment.find()
      }
    },
    appointmentsByStudent: {
      type: new GraphQLList(AppointmentType),
      args: { studentId: { type: GraphQLID } },
      resolve(parent, args) {
        return Appointment.find({ studentId: args.studentId })
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // mutation {
    //   addTutor(name: "John Doe", email: "john@example.com", hourlyRate: 25.5, expertise: ["Math", "Science"], experience: 5) {
    //     id
    //     name
    //     email
    //     hourlyRate
    //     expertise
    //     experience
    //   }
    // }    
    addTutor: {
      type: TutorType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        hourlyRate: { type: GraphQLFloat },
        expertise: { type: new GraphQLList(GraphQLString) },
        experience: { type: GraphQLInt }
      },
      resolve(parent, args) {
        const tutor = new Tutor({
          name: args.name,
          email: args.email,
          hourlyRate: args.hourlyRate,
          expertise: args.expertise,
          experience: args.experience
        })
        return tutor.save()
      }
    },
    addStudent: {
      type: StudentType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        courses: { type: new GraphQLList(GraphQLString) },
        weakPoints: { type: new GraphQLList(GraphQLString) }
      },
      resolve(parent, args) {
        const student = new Student({
          name: args.name,
          email: args.email,
          courses: args.courses,
          weakPoints: args.weakPoints
        })
        return student.save()
      }
    },
    deleteTutor: {
      type: TutorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Tutor.findByIdAndDelete(args.id) 
      }
    },
    deleteStudent: {
      type: StudentType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Student.findByIdAndDelete(args.id) 
      }
    },
    addAppointment: {
      type: AppointmentType,
      args: {
        studentId: { type: GraphQLID },
        tutorId: { type: GraphQLID },
        date: { type: GraphQLString },
        status: { type: GraphQLString }
      },
      resolve(parent, args) {
        const appointment = new Appointment({
          studentId: args.studentId,
          tutorId: args.tutorId,
          date: args.date,
          status: args.status
        })
        return appointment.save()
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
