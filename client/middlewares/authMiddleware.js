const store = require("../model/store")

function filterEntries(entries) {
  const allowedMethods = ["post", "get", "put", "patch", "delete"]
  const filteredEntries = entries.map(entry => {
    const checkedEntry = {}

    if (!(entry && Object.keys(entry) >= 2)) {
      return null;
    }

    if (!entry.name || !entry.name.length || !entry.method) {
      console.log("[WARN] Entry must contain name and method values")
      return null
    }

    checkedEntry.name = entry.name

    if (!allowedMethods.includes(entry.method.toLowerCase())) {
      console.log(`[WARN] Entry with name: ${entry.name} has invalid method: ${entry.method}`)
      return null
    }

    checkedEntry.method = entry.method

    if (entry.queries && Array.isArray(entry.queries) && entry.queries.length) {
      checkedEntry.queries = entry.queries
    }

    if (entry.params && Array.isArray(entry.params) && entry.params.length) {
      checkedEntry.params = entry.params
    }

    return checkedEntry
  }).filter(r => r)

  return filteredEntries
}

module.exports = async function (req, res, next) {
  try {
    const body = req.body
    const entryPoints = []

    if (!body || !Object.keys(body).length) {
      res.status(403).send("No instructions provided!")
      return
    }

    entryPoints.push(...filterEntries(req.body.config))

    res.status(200).send("Connection will be established in several seconds")
  } catch (e) {
    next(e)
  }
}