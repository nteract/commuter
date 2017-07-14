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

    const suffixRegex = /(?:\.([^.]+))?$/;

    const renderSuffixes = new Set(["ipynb", "html", "json", "md", "rmd"]);
    const renderAccepts = new Set(["text/html", "application/xhtml+xml"]);

    const viewHandler = (req: $Request, res: $Response) => {
      const suffix = (suffixRegex.exec(req.path)[1] || "").toLowerCase();
      const accepts = (req.headers.accept || "").split(",");

      if (
        // If one of our suffixes is a renderable item
        renderSuffixes.has(suffix) ||
        // If the file is requested as `text/html` first and foremost, we'll also
        // render our file viewer
        renderAccepts.has(accepts[0]) ||
        renderAccepts.has(accepts[1])
      ) {
        const { pathname, query } = parse(req.url, true);
        const viewPath = req.params["0"] || "/";
        const q = Object.assign({}, { viewPath }, query);
        return frontend.app.render(req, res, "/view", q);
      }

      const newPath = req.path.replace(/^\//, "/files/");
      res.redirect(newPath);
      return;
    };

    router.get(["/view", "/view*"], viewHandler);

    // Hokey pokey passthrough for now
    router.get("*", (req: $Request, res: $Response) => {
      return frontend.handle(req, res);
    });

    // TODO: Leaving this here for the eventual baseURL handling
    const baseURI = "/";
    app.use(baseURI, router);

    // Hokey pokey passthrough for now -- all other request go through next
    app.get(["/view", "/view*"], viewHandler);
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
