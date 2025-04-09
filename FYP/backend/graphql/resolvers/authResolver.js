const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Tutor = require("../../models/Tutor")
const Student = require("../../models/Student")
const TutorType = require("../types/TutorType")
const StudentType = require("../types/StudentType")
const generateToken = require("../../config/generateTokens")
const {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLInputObjectType,
} = require("graphql")

const authMutations = {
  registerTutor: {
    type: TutorType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      image: { type: GraphQLString },
      hourlyRate: { type: GraphQLInt },
      subjects: { type: new GraphQLList(GraphQLString) },
      workingHours: {
        type: new GraphQLList(
          new GraphQLInputObjectType({
            name: "WorkingHourInput",
            fields: {
              day: { type: GraphQLString },
              startTime: { type: GraphQLString },
              endTime: { type: GraphQLString },
            },
          })
        ),
      },
    },
    async resolve(_, args) {
      const { name, email, password, image, hourlyRate, subjects, workingHours } = args
      const normalizedEmail = email.toLowerCase()

      const existingTutor = await Tutor.findOne({ email: normalizedEmail })
      if (existingTutor) {
        throw new Error("Email already in use")
      }
      const tutor = new Tutor({
        name,
        email: normalizedEmail,
        password,
        image: image,
        hourlyRate,
        subjects,
        workingHours,
      })

      await tutor.save()

      return {
        ...tutor._doc,
        id: tutor._id,
        token: generateToken(tutor._id),
      }
    },
  },

  loginTutor: {
    type: TutorType,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    async resolve(_, args) {
      const normalizedEmail = args.email.toLowerCase()
      const { password } = args

      const tutor = await Tutor.findOne({ email: normalizedEmail })
      if (!tutor) throw new Error("Tutor not found")

      const isMatch = await bcrypt.compare(password, tutor.password)
      if (!isMatch) throw new Error("Invalid credentials")

      return {
        ...tutor._doc,
        id: tutor._id,
        token: generateToken(tutor._id),
      }
    },
  },

  registerStudent: {
    type: StudentType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      weakPoints: { type: new GraphQLList(GraphQLString) },
      image: { type: GraphQLString },
    },
    async resolve(_, { name, email, password, weakPoints, image }) {
      const normalizedEmail = email.toLowerCase()

      const existingStudent = await Student.findOne({ email: normalizedEmail })
      if (existingStudent) throw new Error("A student with this email already exists")

      // Do not hash manually; pass plain text
      const student = new Student({
        name,
        email: normalizedEmail,
        password,
        enrolledCourses: [],
        weakPoints,
        image: image,
      })

      await student.save()

      return {
        ...student._doc,
        id: student._id,
        token: generateToken(student._id),
      }
    },
  },

  loginStudent: {
    type: StudentType,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    async resolve(_, args) {
      const normalizedEmail = args.email.toLowerCase()
      const { password } = args

      const student = await Student.findOne({ email: normalizedEmail })
      if (!student) throw new Error("Student not found")

      const isMatch = await bcrypt.compare(password, student.password)
      if (!isMatch) throw new Error("Invalid credentials")

      return {
        ...student._doc,
        id: student._id,
        token: generateToken(student._id),
      }
    },
  },
}


module.exports = { authMutations }