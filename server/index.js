const express = require("express")
const { MongoClient } = require("mongodb")

require("dotenv").config()

const socket = require("./socket/socket")
const store = require("./model/store")
const authMiddleware = require("./middlewares/authMiddleware")
const listeners = require("./socket/listeners")

const app = express()
const port = process.env.PORT || 3001

async function run() {
  const client = new MongoClient(process.env.MONGO_URI)

  await client.connect()

  store.driver = client.db("proxy_db")
  socket.startSocket()

  listeners()

  app.listen(port, () => console.log(`[INFO] App is running on port ${port}`))
}

app.post("/auth", authMiddleware)

run()
  .catch(console.error)