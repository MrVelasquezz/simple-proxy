const store = require("../../model/store")
const checkAuthToken = require("../../helpers/checkAuthToken")
const socketInst = require("../socket")

const handleDisconnect = function (socket, reason) {
  socket.rooms.forEach((key) => {
    if (key.endsWith("_room")) {
      const socketId = key.replace("_room", "")
      store.toggleSocket(socketId)
      console.log(`[INFO] Client with token ${socketId} was disconnected. Reason: ${reason}`)
    }
  })
}

const handleConnect = function (socket) {
  const auth = socket.handshake.auth?.token

  if (!checkAuthToken(auth)) {
    console.log(`[WARN] Client application sent connection request with wrong token`)

    socket.disconnect(true)
    return
  }

  console.log(`[INFO] Client application sent connection request with token ${auth}`)

  if (!store.checkSocketCredentials(auth)) {
    console.log(`[WARN] Client application is unauthorized! Token: ${auth}`)

    socket.disconnect(true)
    return
  }

  const roomName = store.toggleSocket(auth)

  socket.join(roomName)
  socketInst.io.to(roomName).emit("join", true)
  console.log(`[INFO] Client application with token ${auth} connected successfully`)

  socket.on("disconnecting", reason => {
    handleDisconnect(socket, reason)
  })
}

module.exports = handleConnect