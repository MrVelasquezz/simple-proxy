const getSocketRooms = require("../../helpers/getSocketRooms")
const store = require("../../model/store")

const handleDisconnect = function (socket, client, reason) {
  store.toggleSocket(client.auth_token)
  console.log(socket.rooms)
  console.log(`[INFO] Client with token ${client.auth_token} was disconnected from rooms` +
    ` ${Array.from(socket.rooms).join(', ')}. Reason: ${reason}`)
}

module.exports = handleDisconnect