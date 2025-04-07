const Subject = require("../../models/Subject")
const SubjectType = require("../types/SubjectType")
const { adminProtect } = require("../../middleware/adminAuthMiddleware")
const { GraphQLList, GraphQLID, GraphQLString } = require("graphql")

const SubjectQueries = {
  subjects: {
    type: new GraphQLList(SubjectType),
    resolve() {
      return Subject.find()
    }
  }
}

const SubjectMutations = {
  // mutation {
  //   addSubject(name: "Physics") {
  //     id
  //     name
  //   }
  // }
  addSubject: {
    type: SubjectType,
    args: { name: { type: GraphQLString } },
    async resolve(_, args, context) {
      await adminProtect(context)
      const subject = new Subject({ name: args.name })
      return await subject.save()
    }
  },
  deleteSubject: {
    type: SubjectType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await adminProtect(context)
      return await Subject.findByIdAndDelete(args.id)
    }
  }
}

module.exports = { SubjectQueries, SubjectMutations }
