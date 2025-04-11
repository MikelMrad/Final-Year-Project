const Student = require("../../models/Student")
const StudentType = require("../types/StudentType")
const { protect } = require("../../middleware/authMiddleware")
const { adminProtect } = require("../../middleware/adminAuthMiddleware")
const { studentProtect } = require("../../middleware/studentAuthMiddleware")
const generateToken = require("../../config/generateTokens")
const { GraphQLList, GraphQLID, GraphQLString } = require("graphql")

const StudentQueries = {
  students: {
    // query {
    //   students {
    //     id
    //     name
    //     email
    //     appointments {
    //       id
    //       date
    //       tutor { name }
    //     }
    //     weakPoints
    //   }
    // }  
    type: new GraphQLList(StudentType),
    async resolve(_, args, context) {
      await studentProtect(context)
      return await Student.find().populate({
        path: "appointments",
        populate: { path: "tutor" }
      })
    }
  },
  student: {
    // query {
    //   student(id: "STUDENT_ID") {
    //     id
    //     name
    //     email
    //     appointments {
    //       date
    //       confirmed
    //     }
    //     weakPoints
    //   }
    // }    
    type: StudentType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await studentProtect(context)
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
    // mutation {
    //   addStudent(name: "", email: "", password: "", weakPoints: [""]) {
    //     id name email weakPoints appointments { id }
    //   }
    // } 
    type: StudentType,
    args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      weakPoints: { type: new GraphQLList(GraphQLString) }
    },
    async resolve(_, args) {
      try {
        const existingStudent = await Student.findOne({ email: args.email })
        if (existingStudent) {
          throw new Error("A student with this email already exists.")
        }
        const student = new Student({
          name: args.name,
          email: args.email,
          password: args.password,
          appointments: [],
          weakPoints: args.weakPoints
        })

        await student.save()
        const token = generateToken(student._id)
        student.token = token
        return student
      } catch (error) {
        console.error("Error in addStudent mutation:", error)
        throw new Error("Could not save student.")
      }
    }
  },
  updateStudent: {
    // mutation {
    //   updateStudent(id: "STUDENT_ID", name: "", appointments: ["APPT_ID"]) { id name appointments { date } }
    // }
    type: StudentType,
    args: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      weakPoints: { type: new GraphQLList(GraphQLString) },
      appointments: { type: new GraphQLList(GraphQLID) },
      image: { type: GraphQLString }
    },
    async resolve(_, args, context) {
      await protect(context)
      const { id, name, email, password, weakPoints, appointments, image } = args
      if (
        name === undefined &&
        email === undefined &&
        password === undefined &&
        weakPoints === undefined &&
        appointments === undefined &&
        image === undefined
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
      return await Student.findByIdAndDelete(args.id)
    }
  }
}

module.exports = { StudentQueries, StudentMutations }
