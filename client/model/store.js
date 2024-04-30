function addServiceIfNotExists(config) {
  if (!(config.local_adr && config.global_adr &&
    config.api_key && config.api_key.length === 32)) {
    return -1
  }

  if (this.serviceLoggedIn.has(config.api_key)) {
    const service = this.serviceLoggedIn.get(config.api_key)

    Object.assign(service, config)

    return 0
  }

  this.serviceLoggedIn.set(config.api_key, config)

  return 1
}

const store = {
  serviceLoggedIn: new Map(),
  addServiceIfNotExists
}

module.exports = store