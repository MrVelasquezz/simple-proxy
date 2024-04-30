

// will be useful in case of better security measures 
module.exports = function (entries) {
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