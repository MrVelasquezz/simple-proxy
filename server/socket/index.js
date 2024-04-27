const { Server } = require("socket.io")

const socket = {
  io: null,
  port: process.env.SOCKET_PORT || 8080,
  startSocket,
  startListener
}

function startSocket() {
  this.io = new Server(this.port)

  console.log(`[INFO] Socket server is running on port ${this.port}`)
  this.startListener()
}

function startListener() {
  this.io.on("connection", (socket) => {

    // more listeners here
  })
}

module.exports = socket