module.exports = (socket) => {
  const ids = []
  socket.rooms.forEach((key) => {
    if (key.endsWith("_room")) {
      const socketId = key.replace("_room", "")
      ids.push(socketId)
    }
  })
  return ids
}