const Student = require("../../models/Student")
const StudentType = require("../types/StudentType")
const { protect, adminProtect } = require("../../middleware/authMiddleware")
const generateToken = require("../../config/generateTokens")
const { GraphQLList, GraphQLID, GraphQLString, GraphQLInt } = require("graphql")
const Appointment = require("../../models/Appointment")

const StudentQueries = {
  students: {
    type: new GraphQLList(StudentType),
    async resolve(_, args, context) {
      await protect(context)
      return await Student.find().populate({
        path: "appointments",
        populate: { path: "tutor" }
      })
    }
  },
  student: {
    type: StudentType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await protect(context)
      const student = await Student.findById(args.id).populate({
        path: "appointments",
        populate: { path: "tutor" }
      })
      if (!student) throw new Error("Student not found")
      return student
    }
  }
}

const StudentMutations = {
  addStudent: {
    type: StudentType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      weakPoints: { type: new GraphQLList(GraphQLString) },
      image: { type: GraphQLString },
      grade: { type: GraphQLInt } // <-- New grade argument
    },
    async resolve(_, args) {
      const existingStudent = await Student.findOne({ email: args.email })
      if (existingStudent) {
        throw new Error("A student with this email already exists.")
      }
      const student = new Student({
        name: args.name,
        email: args.email,
        password: args.password,
        weakPoints: args.weakPoints,
        image: args.image,
        grade: args.grade // <-- Save student's grade
      })

      await student.save()
      const token = generateToken(student._id)
      student.token = token
      return student
    }
  },
  updateStudent: {
    type: StudentType,
    args: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      weakPoints: { type: new GraphQLList(GraphQLString) },
      appointments: { type: new GraphQLList(GraphQLID) },
      image: { type: GraphQLString },
      grade: { type: GraphQLInt } // Allow updating grade
    },
    async resolve(_, args, context) {
      await protect(context)
      const { id, name, email, password, weakPoints, appointments, image, grade } = args
      if (
        name === undefined &&
        email === undefined &&
        password === undefined &&
        weakPoints === undefined &&
        appointments === undefined &&
        image === undefined &&
        grade === undefined
      ) {
        throw new Error("At least one field must be provided to update")
      }
      const updateFields = {}
      if (name !== undefined) updateFields.name = name
      if (email !== undefined) updateFields.email = email
      if (password !== undefined) {
        updateFields.password = await require("bcryptjs").hash(password, 10)
      }
      if (weakPoints !== undefined) updateFields.weakPoints = weakPoints
      if (appointments !== undefined) updateFields.appointments = appointments
      if (image !== undefined) updateFields.image = image
      if (grade !== undefined) updateFields.grade = grade  // Update grade field
      const updatedStudent = await Student.findByIdAndUpdate(id, updateFields, { new: true }).populate({
        path: "appointments",
        populate: { path: "tutor" }
      })
      if (!updatedStudent) throw new Error("Student not found")
      return updatedStudent
    }
  },
  deleteStudent: {
    type: StudentType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await adminProtect(context)
      const deletedStudent = await Student.findByIdAndDelete(args.id)
      if (!deletedStudent) throw new Error("Student not found")
      await Appointment.deleteMany({ student: args.id })
      return deletedStudent
    }
  }
}

module.exports = { StudentQueries, StudentMutations }
