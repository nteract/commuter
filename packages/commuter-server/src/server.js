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
  const frontend = front.createNextApp();

  return frontend.app.prepare().then(() => {
    const app = express();
    app.use(morgan("common"));

    log.info(`Node env: ${config.nodeEnv}`);

    // Last middleware
    const router = require("./routes");

    router.get(["/view", "/view*"], (req: $Request, res: $Response) => {
      const { pathname, query } = parse(req.url, true);
      const viewPath = req.params["0"] || "/";

      const q = Object.assign({}, { viewPath }, query);

      console.log("baseUrl", req.baseUrl);
      return frontend.app.render(req, res, "/view", q);
    });

    // Hokey pokey passthrough for now
    router.get("*", (req: $Request, res: $Response) => {
      return frontend.handle(req, res);
    });

    const baseURI = "/trial";
    app.use(baseURI, router);

    // Hokey pokey passthrough for now
    app.use((req: $Request, res: $Response) => {
      return frontend.handle(req, res);
    });

    const server = http.createServer(app);

    return new Promise(accept => {
      server.listen(config.port, () => {
        accept(server);
      });
    });
  });
}

module.exports = createServer;
