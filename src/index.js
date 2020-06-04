// @flow
const log = require("log");

const createServer = require("./backend/server");

createServer()
  .then(server => {
    const port = server.address().port;
    console.log(log);
    log.info("Commuter server listening on port " + port);
  })
  .catch((e: Error) => {
    console.error(e);
    console.error(e.stack);
    process.exit(-10);
  });
