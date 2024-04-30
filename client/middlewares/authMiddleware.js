const store = require("../model/store")
const socket = require("../socket/socket")
const checkServiceValidity = require("../helpers/checkServiceValidity")

//const filterEntries = require("../helpers/filterEntries")

module.exports = async function (req, res, next) {
  try {
    const body = req.body
    //const entryPoints = []

    if (!body || !Object.keys(body).length) {
      res.status(403).send("No instructions provided!")
      return
    }

    //entryPoints.push(...filterEntries(req.body.config))


    switch (store.addServiceIfNotExists(body)) {
      case -1:
        res.status(403).send("Not all instructions were provided!")
        break
      case 0:
        res.status(200).send("Service already exists. Relog!")
        break
      case 1:
        res.status(200).send("Service was registered successfully!")
        break
    }
    socket.socket.emit("new_service", { services: [1, 2, 3] })
  } catch (e) {
    next(e)
  }
}