import mongoose from "mongoose"

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI)
  } catch (error){
    console.error(`Error: ${error.message}`)
    process.exit(1) // 1 code mean a failure but 0 means sucess
  }
}