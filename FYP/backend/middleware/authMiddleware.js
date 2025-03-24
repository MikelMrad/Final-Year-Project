const jwt = require("jsonwebtoken")
const Tutor = require("../models/Tutor")
const Student = require("../models/Student")

const protect = async (resolve, parent, args, context, info) => {
  // context.req.headers.authorization should contain "Bearer <token>"
  const authHeader = context.req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authorized, no token")
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    let user = await Tutor.findById(decoded.id).select("-password")
    if (!user) {
      user = await Student.findById(decoded.id).select("-password")
    }
    if (!user) {
      throw new Error("Not authorized, user not found")
    }

    context.req.user = user

    return resolve(parent, args, context, info)
  } catch (error) {
    throw new Error("Not authorized, token failed")
  }
}

module.exports = { protect }
