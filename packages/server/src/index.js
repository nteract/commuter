// @flow
const createServer = require("./server"),
  Log = require("log"),
  log = new Log("info");

createServer().then(server => {
  const port = server.address().port;
  log.info("Commuter server listening on port " + port);
});
