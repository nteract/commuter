// @flow

import type { $Request, $Response } from "express";

const express = require("express"), path = require("path");

const createAPIRouter = require("./api");

function createRouter(config): express.Router {
  const router = express.Router();
  // TODO: Accept content provider choice
  // TODO: Load the configured router

  let contentsProvider;

  switch (config.storageBackend) {
    case "s3":
      contentsProvider = require("../content-providers/s3");
      break;
    case "local":
    default:
      contentsProvider = require("../content-providers/local");
  }

  // we only provide the elasticsearch storage currently
  const discoveryProvider = require("../discovery-providers/elasticsearch");

  const apiRouter = createAPIRouter({
    contents: contentsProvider.createContentsRouter(config.storage),
    discovery: discoveryProvider.createDiscoveryRouter(config.discovery)
  });

  router.use("/api", apiRouter);
  router.use("/files", contentsProvider.createFilesRouter(config.storage));

  router.use("/view", require("./view"));

  //commuter-client
  router.get("*", (req: $Request, res: $Response) => {
    res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
  });
  return router;
}

// Keeping the singleton on the export to make it work in-place right now
module.exports = createRouter(require("../config"));
