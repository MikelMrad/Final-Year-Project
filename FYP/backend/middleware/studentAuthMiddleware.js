const jwt = require("jsonwebtoken")
const Student = require("../models/Student")

const studentProtect = async (context) => {
  if (!context?.req?.headers?.authorization) {
    throw new Error("Authorization header missing")
  }
  const authHeader = context.req.headers.authorization
  const [bearer, token] = authHeader.split(" ")
  if (bearer !== "Bearer" || !token) {
    throw new Error("Invalid token format")
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const student = await Student.findById(decoded.id).select("-password")
    if (!student) {
      throw new Error("Student not found")
    }
    context.student = student
  } catch (error) {
    throw new Error("Not authorized")
  }
}

module.exports = { studentProtect }
