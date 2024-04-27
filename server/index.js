const express = require("express")
const { MongoClient } = require("mongodb")

require("dotenv").config()

const socket = require("./socket/index")
const authMiddleware = require("./middlewares/authMiddleware")

const app = express()
const port = process.env.PORT || 3001

async function run() {
  socket.startSocket()
  const client = new MongoClient(process.env.MONGO_URI)

  await client.connect()

  app.listen(port, () => console.log(`[INFO] App is running on port ${port}`))
}

app.post("/auth", authMiddleware)

run()
  .catch(console.error)