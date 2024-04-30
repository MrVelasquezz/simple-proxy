const express = require("express")

const store = require('./model/store')
const socket = require('./socket/socket')
const authMiddleware = require('./middlewares/authMiddleware')

require("dotenv").config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

async function run() {
  const serverAuth = await fetch(process.env.SERVER_ADDR + "/auth", {
    method: "POST",
    headers: {
      "Authorization": process.env.API_KEY
    }
  })

  if (!serverAuth.ok) {
    const statusText = await serverAuth.text()
    console.log(`[API ERROR] ${statusText}`)
    return
  }
  const socketPort = await serverAuth.json()
  socket.startSocket(socketPort.port)

  app.listen(port, () => console.log(`[INFO] Server is running on port ${port}`))
}

app.post("/auth", authMiddleware)

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send("Internal Error")
})

run()
  .catch(console.error)
