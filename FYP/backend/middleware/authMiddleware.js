const jwt = require("jsonwebtoken");
const Tutor = require("../models/Tutor");

const protect = async (context) => {
  try {
    // Ensure context and req exist
    if (!context || !context.req) {
      throw new Error("No context or request found");
    }

    // Check for Authorization header
    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    // Split header into parts (expecting "Bearer <token>")
    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
      throw new Error("Invalid authorization header format");
    }
    const [bearer, token] = parts;
    if (bearer !== "Bearer" || !token) {
      throw new Error("Invalid token format");
    }

    // Log token for debugging
    console.log("Token:", token);

    // Verify JWT using the secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded); // Debug log

    // Ensure decoded token has an id property
    if (!decoded.id) {
      throw new Error("Decoded token missing id");
    }

    // Find the tutor by decoded id
    const user = await Tutor.findById(decoded.id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }

    // Attach user info to context for use in resolvers
    context.user = user;
  } catch (error) {
    console.error("Authentication Error:", error.message);
    throw new Error("Not authorized");
  }
};

module.exports = { protect };
