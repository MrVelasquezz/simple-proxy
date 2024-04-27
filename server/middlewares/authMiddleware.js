


module.exports = async function (req, res) {
  const authKey = req.headers.authorization

  if (!authKey || authKey.length !== 32) {
    res.status(403).send("Wrong auth key!")

    return
  }
}