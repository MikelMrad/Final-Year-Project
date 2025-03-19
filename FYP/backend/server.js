const express = require("express")
const dotenv = require("dotenv").config()
const { errorHandler } = require("./middleware/errorMiddleware")
const colors = require("colors")
const connectDb = require("./config/db")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./graphql/schema")
const port = process.env.PORT || 5000

connectDb()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true 
}))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`.green))
