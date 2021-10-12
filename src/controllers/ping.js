function ping(req, res) {
  res.status(200).json({
    ping: "pong",
  });
}

module.exports = {
  ping,
};
