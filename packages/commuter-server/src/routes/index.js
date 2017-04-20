// @flow

import type { $Request, $Response } from "express";

const express = require("express"),
  path = require("path"),
  router = express.Router();

router.use("/api", require("./api"));

router.use("/files", require("./files"));
router.use("/view", require("./view"));

//commuter-client
router.get("*", (req: $Request, res: $Response) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
});

module.exports = router;
