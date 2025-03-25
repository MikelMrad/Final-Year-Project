const Subject = require("../../models/Subject")
const SubjectType = require("../types/SubjectType")
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
  addSubject: {
    type: SubjectType,
    args: { name: { type: GraphQLString } },
    resolve(_, args) {
      const subject = new Subject({ name: args.name })
      return subject.save()
    }
  },
  deleteSubject: {
    type: SubjectType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Subject.findByIdAndDelete(args.id)
    }
  }
}

module.exports = { SubjectQueries, SubjectMutations }
