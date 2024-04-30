const { Server } = require("socket.io")

const socket = {
  io: null,
  port: process.env.SOCKET_PORT || 8080,
  startSocket
}

function startSocket() {
  this.io = new Server(this.port, {
    pingInterval: 10000,
    pingTimeout: 5000
  })

  console.log(`[INFO] Socket server is running on port ${this.port}`)
}

module.exports = socket