const Admin = require("../../models/Admin")
const AdminType = require("../types/AdminType")
const { GraphQLString, GraphQLNonNull } = require("graphql")
const generateToken = require("../../config/generateTokens")
const { adminProtect } = require("../../middleware/adminAuthMiddleware")

const AdminMutations = {
  registerAdmin: {
    // mutation {
    //   registerAdmin(name: "Mikel Mrad", email: "mikel@mrad.com", password: "1234567890") {
    //     id
    //     name
    //     email
    //     token
    //   }
    // }
    type: AdminType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_, args) {
      const existingAdmin = await Admin.findOne({ email: args.email })
      if (existingAdmin) throw new Error("Admin already exists")
      const admin = new Admin({
        name: args.name,
        email: args.email,
        password: args.password,
      })
      await admin.save()
      return {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        image: admin.image,
        token: generateToken(admin._id),
      }
    },
  },
  loginAdmin: {
    // mutation {
    //   loginAdmin(email: "admin@example.com", password: "123456") {
    //     id
    //     name
    //     email
    //     token
    //   }
    // }
    type: AdminType,
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_, args) {
      const admin = await Admin.findOne({ email: args.email })
      if (!admin || !(await admin.matchPassword(args.password))) {
        throw new Error("Invalid email or password")
      }

      return {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        image: admin.image,
        token: generateToken(admin._id),
      }
    },
  },
}

const AdminQueries = {
  getAdminProfile: {
    type: AdminType,
    async resolve(_, __, context) {
      await adminProtect(context)
      return context.admin
    },
  },
}

module.exports = { AdminMutations, AdminQueries }
