const jwt = require("jsonwebtoken")
const Tutor = require("../models/Tutor")
const Student = require("../models/Student")
const Admin = require("../models/Admin")

const protect = async (context) => {
  try {
    if (!context || !context.req) throw new Error("No context or request found")

    const authHeader = context.req.headers.authorization
    if (!authHeader) throw new Error("Authorization header missing")

    const [bearer, token] = authHeader.split(" ")
    if (bearer !== "Bearer" || !token) throw new Error("Invalid token format")

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded.id) throw new Error("Decoded token missing id")

    const tutor = await Tutor.findById(decoded.id).select("-password")
    const student = await Student.findById(decoded.id).select("-password")
    const admin = await Admin.findById(decoded.id).select("-password")

    const user = tutor || student || admin
    if (!user) throw new Error("User not found")

    context.user = user
  } catch (error) {
    throw new Error("Not authorized")
  }
}

module.exports = { protect }
