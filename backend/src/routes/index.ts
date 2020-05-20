import express = require("express");

import { Config } from "../config";

const createAPIRouter = require("./api");

function createRouter(config: Config): express.Router {
  const contentsProvider = require("../content-providers/local");
  const s3ContentsProvider = require("./api/s3");

  const apiRouter = createAPIRouter({
    contents: contentsProvider.createContentsRouter(config.storage),
    s3contents: s3ContentsProvider.createContentsRouter(config.s3storage)
  });

  const router = express.Router();

  router.use("/api", apiRouter);
  router.use("/files", contentsProvider.createFilesRouter(config.storage));
  router.use(
    "/s3-files",
    s3ContentsProvider.createFilesRouter(config.s3storage)
  );

  return router;
}

// Keeping the singleton on the export to make it work in-place right now
module.exports = createRouter(require("../config"));
