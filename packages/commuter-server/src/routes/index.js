// @flow

import type { $Request, $Response } from "express";

const express = require("express"),
  path = require("path"),
  router = express.Router();

const createAPIRouter = require("./api");

// TODO: Accept content provider choice
// TODO: Load the configured router

const contentsProvider = require("../content-providers/s3");

const apiRouter = createAPIRouter(contentsProvider.createContentsRouter());

router.use("/api", apiRouter);
router.use("/files", contentsProvider.createFilesRouter());
router.use("/view", require("./view"));

//commuter-client
router.get("*", (req: $Request, res: $Response) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
});

module.exports = router;
