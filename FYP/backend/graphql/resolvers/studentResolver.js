const Student = require("../../models/Student")
const StudentType = require("../types/StudentType")
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
    //     enrolledCourses
    //     weakPoints
    //   }
    // }  
    type: new GraphQLList(StudentType),
    async resolve(_, args, context) {
      await studentProtect(context)
      return await Student.find()
    }
  },
  student: {
    // query {
    //   student(id: "60f5a4f2b5e3b90017d25b8a") {
    //     id
    //     name
    //     email
    //     enrolledCourses
    //     weakPoints
    //   }
    // }    
    type: StudentType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await studentProtect(context)
      const student = await Student.findById(args.id)
      if (!student) throw new Error("Student not found")
      return student
    }
  }
}

const StudentMutations = {
  addStudent: {
    // mutation {
    //   addStudent(
    //     name: "Alice Johnson"
    //     email: "alice@example.com"
    //     password: "securepassword"
    //     weakPoints: ["Grammar"]
    //   ) {
    //     id
    //     name
    //     email
    //     weakPoints
    //     enrolledCourses
    //     token
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
          enrolledCourses: [],
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
    // mutation {
    //   updateStudent(
    //     id: "STUDENT_ID"
    //     name: "New Student Name"
    //     email: "newemail@example.com"
    //   ) {
    //     id
    //     name
    //     email
    //     weakPoints
    //     enrolledCourses
    //     image
    //   }
    // }
  updateStudent: {
    type: StudentType,
    args: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      weakPoints: { type: new GraphQLList(GraphQLString) },
      enrolledCourses: { type: new GraphQLList(GraphQLString) },
      image: { type: GraphQLString }
    },
    async resolve(_, args, context) {
      await protect(context) // Ensure the student (or authorized user) is authenticated
      const { id, name, email, password, weakPoints, enrolledCourses, image } = args
      if (
        name === undefined &&
        email === undefined &&
        password === undefined &&
        weakPoints === undefined &&
        enrolledCourses === undefined &&
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
      if (enrolledCourses !== undefined) updateFields.enrolledCourses = enrolledCourses
      if (image !== undefined) updateFields.image = image
      const updatedStudent = await Student.findByIdAndUpdate(id, updateFields, { new: true })
      if (!updatedStudent) throw new Error("Student not found")
      return updatedStudent
    }
  },
  deleteStudent: {
    // mutation {
    //   deleteStudent(id: "60f5a4f2b5e3b90017d25b8a") {
    //     id
    //     name
    //   }
    // }
    type: StudentType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await adminProtect(context)
      return await Student.findByIdAndDelete(args.id)
    }
  }
}

module.exports = { StudentQueries, StudentMutations }
