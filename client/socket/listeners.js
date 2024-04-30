module.exports = (socket) => {
  socket.socket.on("disconnect", reason => {
    console.log(`Disconnected due reason: ${reason}`)
    socket.connected = false
  })

  socket.socket.on("join", () => {
    console.log("Socket joined")
    socket.connected = true
  })

  socket.socket.on("message", msg => {
    console.log(msg)
  })
}
