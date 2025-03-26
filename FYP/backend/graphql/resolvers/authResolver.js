const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Tutor = require("../../models/Tutor")
const Student = require("../../models/Student")
const TutorType = require("../types/TutorType")
const StudentType = require("../types/StudentType")
const generateToken = require("../../config/generateTokens")
const { GraphQLString, GraphQLList } = require("graphql")

const authMutations = {
  // mutation {
  //   registerTutor(name: "John Doe", email: "john@example.com", password: "password123") {
  //     id
  //     name
  //     email
  //     token
  //   }
  // }
  registerTutor: {
    type: TutorType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    async resolve(_, args) {
      const { name, email, password } = args
      const existingTutor = await Tutor.findOne({ email })
      if (existingTutor) {
        throw new Error("Email already in use")
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const tutor = new Tutor({
        name,
        email,
        password: hashedPassword,
      })
      await tutor.save()
      return {
        ...tutor._doc,
        id: tutor._id,
        token: generateToken(tutor._id),
      }
    }
  },
  // mutation {
  //   loginTutor(email: "john@example.com", password: "password123") {
  //     id
  //     name
  //     email
  //     token
  //   }
  // }
  loginTutor: {
    type: TutorType,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    async resolve(_, args) {
      const { email, password } = args
      const tutor = await Tutor.findOne({ email })
      if (!tutor) {
        throw new Error("Tutor not found")
      }
      const isMatch = await bcrypt.compare(password, tutor.password)
      if (!isMatch) {
        throw new Error("Invalid credentials")
      }
      return {
        ...tutor._doc,
        id: tutor._id,
        token: generateToken(tutor._id),
      }
    }
  },
  // mutation {
  //   registerStudent(name: "Alice Johnson", email: "alice@example.com", password: "securepassword", weakPoints: ["Grammar"]) {
  //     id
  //     name
  //     email
  //     weakPoints
  //     enrolledCourses
  //     token
  //   }
  // }
  registerStudent: {
    type: StudentType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      weakPoints: { type: new GraphQLList(GraphQLString) },
    },
    async resolve(_, args) {
      const { name, email, password, weakPoints } = args
      const existingStudent = await Student.findOne({ email })
      if (existingStudent) {
        throw new Error("A student with this email already exists")
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const student = new Student({
        name,
        email,
        password: hashedPassword,
        enrolledCourses: [],
        weakPoints,
      })
      await student.save()
      return {
        ...student._doc,
        id: student._id,
        token: generateToken(student._id),
      }
    }
  },
  // mutation {
  //   loginStudent(email: "alice@example.com", password: "securepassword") {
  //     id
  //     name
  //     email
  //     token
  //   }
  // }
  loginStudent: {
    type: StudentType,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    async resolve(_, args) {
      const { email, password } = args
      const student = await Student.findOne({ email })
      if (!student) {
        throw new Error("Student not found")
      }
      const isMatch = await bcrypt.compare(password, student.password)
      if (!isMatch) {
        throw new Error("Invalid credentials")
      }
      return {
        ...student._doc,
        id: student._id,
        token: generateToken(student._id),
      }
    }
  },
}

module.exports = { authMutations }
