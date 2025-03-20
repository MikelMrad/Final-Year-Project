const Student = require("../../models/Student")
const StudentType = require("../types/StudentType")
const { GraphQLList, GraphQLID, GraphQLString, GraphQLList: List } = require("graphql")

const StudentQueries = {
  students: {
    type: new GraphQLList(StudentType),
    resolve() {
      return Student.find()
    }
  },
  student: {
    type: StudentType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Student.findById(args.id)
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
      enrolledCourses: { type: new List(GraphQLString) },
      weakPoints: { type: new List(GraphQLString) }
    },
    resolve(_, args) {
      const student = new Student({
        name: args.name,
        email: args.email,
        password: args.password,
        enrolledCourses: args.enrolledCourses,
        weakPoints: args.weakPoints
      })
      return student.save()
    }
  },
  deleteStudent: {
    type: StudentType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Student.findByIdAndDelete(args.id)
    }
  }
}

module.exports = { StudentQueries, StudentMutations }
