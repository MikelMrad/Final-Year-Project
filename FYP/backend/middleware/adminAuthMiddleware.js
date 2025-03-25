const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

const adminProtect = async (context) => {
  try {
    if (!context?.req?.headers?.authorization) {
      throw new Error("Authorization header missing")
    }

    const authHeader = context.req.headers.authorization
    const [bearer, token] = authHeader.split(" ")

    if (bearer !== "Bearer" || !token) {
      throw new Error("Invalid token format")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password")

    if (!admin) throw new Error("Admin not found")

    context.admin = admin;
  } catch (error) {
    throw new Error("Not authorized as admin")
  }
}

module.exports = { adminProtect }
