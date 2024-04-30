const handleConnect = require("./middlewares/connect")
const socket = require("./socket")

module.exports = () => {
  socket.io.on("connection", handleConnect)
}