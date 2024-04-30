const socket = require("../socket/socket")
const store = require("../model/store")
const checkAuthToken = require("../helpers/checkAuthToken")

module.exports = async function (req, res) {
  let authKey = req.headers.authorization

  if (!checkAuthToken(authKey)) {
    console.log(`[WARN] Client application sent connection request with wrong token`)
    res.status(401).send("Wrong auth token")

    return
  }

  if (store.isRateLimited(authKey)) {
    console.log(`[WARN] Client application with token ${authKey} is ratelimited!`)
    res.status(403).send(`Rate limit! Wait ${store.rateLimitInMS} ms`)
    return
  }

  const client = await store.checkClient(authKey)
  if (!client) {
    console.log(`[WARN] Client application with token ${authKey} is unauthorized!`)
    res.status(401).send("Unauthorized")
    return
  }

  store.addClient(authKey)

  console.log(`[INFO] Client application with token ${authKey} was successfully authorized!`)

  res.status(200).json({
    port: socket.port
  })
}