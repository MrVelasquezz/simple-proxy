const checkAuthToken = require("../helpers/checkAuthToken")

function addRequestToQueue(request) {
  return
}

async function checkClient(auth_token) {
  const clientIfExists = this.clients.get(auth_token)
  if (clientIfExists) {
    return clientIfExists
  }

  if (!this.driver) {
    throw new Error("[ERROR] Database driver is not aviable")
  }

  try {
    auth_token = encodeURIComponent(auth_token)
    const client = this.driver.collection("authorities")
      .findOne({ auth_token: auth_token }, {
        projection: { _id: 0, auth_token: 1 }
      })

    if (!client) {
      return false
    }

    client.connected = false

    this.clients.set(auth_token, client)

    return client
  } catch (e) {
    console.log("[ERROR] Error ocurred while searching for client.\n", e)
    return null
  }
}

function isRateLimited(auth_token) {
  const rateUntilMS = Date.now() + this.rateLimitInMS
  const client = this.rateLimitBuffer.get(auth_token)

  if (!client) {
    this.rateLimitBuffer.set(auth_token, {
      rated_until: rateUntilMS
    })
    return false
  }

  if (client.rated_until < Date.now()) {
    this.rateLimitBuffer.delete(auth_token)
    return false
  }

  client.ratedUntil = rateUntilMS
  return true
}

function addClient(auth_token) {
  const clientIfExists = this.clients.get(auth_token)
  const loginUntil = Date.now() + this.clientConnTimeLimit
  if (clientIfExists) {
    clientIfExists.login_until = loginUntil
  }
  else {
    this.clients.add(auth_token, {
      login_until: loginUntil
    })
  }
  return loginUntil
}

function checkSocketCredentials(token) {
  if (!checkAuthToken(token)) {
    return false
  }

  const client = this.clients.get(token)

  if (!client) {
    return false
  }

  if (Date.now() > client.login_until) {
    return false
  }
  return true
}

function toggleSocket(token) {
  const client = this.clients.get(token)

  client.connected = !client.connected
  if (client.connected) {
    client.room = token + "_room"
  }
  else {
    client.room = null
  }

  return client.room
}

const store = {
  driver: null,
  requests: new Map(),
  clients: new Map(),
  rateLimitBuffer: new Map(),
  rateLimitInMS: parseInt(process.env.RATE_LIMIT),
  clientConnTimeLimit: parseInt(process.env.MAX_CONN_TIMEOUT),
  addRequestToQueue,
  checkClient,
  addClient,
  isRateLimited,
  checkSocketCredentials,
  toggleSocket
}

module.exports = store