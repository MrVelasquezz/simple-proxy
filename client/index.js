const express = require("express")
const { MongoClient } = require("mongodb")

const store = require('./model/store')
const authMiddleware = require('./middlewares/authMiddleware')

require("dotenv").config()

const app = express()
const port = process.env.PORT || 3000


async function run() {
  const client = new MongoClient(process.env.MONGO_URI)

  await client.connect()

  store.driver = client

  app.listen(port, () => console.log(`[INFO] Server is running on port ${port}`))
}

app.post("/auth", authMiddleware)

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send("Internal Error")
})

run()
  .catch(console.error)
