const handleNewService = require("./middlewares/newService")
const handleDisconnect = require("./middlewares/disconnect")
const store = require("../model/store")
const checkAuthToken = require("../helpers/checkAuthToken")
const socketDriver = require("./socket")

module.exports = () => {
  socketDriver.io.on("connection", (socket) => {
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

    const client = store.clients.get(auth)
    const roomName = store.toggleSocket(auth)

    socket.join(roomName)
    socketDriver.io.to(roomName).emit("join", true)
    console.log(`[INFO] Client application with token ${auth} connected successfully`)

    socket.on("disconnecting", reason => {
      handleDisconnect(socket, client, reason)
    })

    socket.on("new_service", service_config => {
      handleNewService(socket, service_config)
    })
  })
}