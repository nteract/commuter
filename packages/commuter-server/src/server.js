// @flow

import type { $Request, $Response } from "express";

const express = require("express"),
  http = require("http"),
  path = require("path"),
  morgan = require("morgan"),
  config = require("./config"),
  Log = require("log"),
  log = new Log("info");

const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

function createServer() {
  return nextApp.prepare().then(() => {
    const app = express();
    app.use(morgan("common"));

    const nextJSRouter = express.Router();
    nextJSRouter.get("*", (req: $Request, res: $Response) => {
      console.log("NEXTING", req);
      nextApp.render(req, res, "/what", req.query);
    });

    app.use("/next", nextJSRouter);

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
  });
}

module.exports = createServer;
