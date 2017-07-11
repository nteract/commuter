// @flow

import type { $Request, $Response } from "express";

const front = require("@nteract/commuter-frontend");

const { parse } = require("url");

const express = require("express"),
  http = require("http"),
  path = require("path"),
  morgan = require("morgan"),
  config = require("./config"),
  Log = require("log"),
  log = new Log("info");

function createServer() {
  const app = express();
  app.use(morgan("common"));

  app.use(express.static("static"));

  log.info(`Node env: ${config.nodeEnv}`);

  app.use(
    "/nteract/commuter",
    express.static(path.resolve(__dirname, "..", "build"))
  );

  // Last middleware
  app.use(require("./routes"));

  const server = http.createServer(app);

  return new Promise(accept => {
    server.listen(config.port, () => {
      accept(server);
    });
  });
}

module.exports = createServer;
