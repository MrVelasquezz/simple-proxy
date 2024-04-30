module.exports = function (token) {
  try {
    if (!token) {
      throw new Error("Bad token")
    }

    token = encodeURIComponent(token)

    if (token.length != 32) {
      throw new Error("Bad token")
    }

    return true
  } catch (e) {
    return false
  }
}
