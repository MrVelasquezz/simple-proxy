const { io } = require("socket.io-client")

const middleware = require("./listeners")

function startSocket(port) {
  if (!process.env.SERVER_ADDR || !port) {
    throw new Error("[ERROR] No server address or port provided")
  }

  const serverAddress = process.env.SOCKET_ADDR.replace("[port]", port)

  const socket = io(serverAddress, {
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
    auth: {
      token: process.env.API_KEY
    }
  })

  this.socket = socket
  middleware(this)
}

const socket = {
  socket: null,
  connected: false,
  startSocket
}

module.exports = socket