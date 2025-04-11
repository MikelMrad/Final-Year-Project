const express = require("express")
const dotenv = require("dotenv").config()
const cors = require("cors")
const { errorHandler } = require("./middleware/errorMiddleware")
const colors = require("colors")
const connectDb = require("./config/db")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./graphql/schema")

const port = process.env.PORT || 5000

connectDb()

const app = express()

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST"],
  credentials: true
}))

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: schema,
    graphiql: {
      headerEditorEnabled: true, 
      docExplorerEnabled: true,
    },
    context: { req },
  }))
)

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`.green.bold))
