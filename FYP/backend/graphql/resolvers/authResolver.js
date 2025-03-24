const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Tutor = require("../../models/Tutor")
const TutorType = require("../types/TutorType")
const { GraphQLString } = require("graphql")

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, "your_secret_key", {
    expiresIn: "1d",
  })
}

const authResolvers = {
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
        token: generateToken(tutor),
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
        token: generateToken(tutor),
      }
    },
  },
}

module.exports = { authResolvers }
