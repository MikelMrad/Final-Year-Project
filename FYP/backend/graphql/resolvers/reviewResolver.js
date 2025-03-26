const Review = require("../../models/Review")
const ReviewType = require("../types/ReviewType")
const { GraphQLList, GraphQLID, GraphQLInt, GraphQLString } = require("graphql")

const ReviewQueries = {
  reviews: {
    type: new GraphQLList(ReviewType),
    resolve() {
      return Review.find().populate("student tutor")
    }
  },
  review: {
    type: ReviewType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Review.findById(args.id).populate("student tutor")
    }
  }
}

const ReviewMutations = {
  addReview: {
    type: ReviewType,
    args: {
      student: { type: GraphQLID },
      tutor: { type: GraphQLID },
      rating: { type: GraphQLInt },
      comment: { type: GraphQLString }
    },
    resolve(_, args) {
      const review = new Review({
        student: args.student,
        tutor: args.tutor,
        rating: args.rating,
        comment: args.comment
      })
      return review.save()
    }
  },
  deleteReview: {
    type: ReviewType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args, context) {
      await adminProtect(context)
      return await Review.findByIdAndDelete(args.id)
    }
  }
  
}

module.exports = { ReviewQueries, ReviewMutations }
