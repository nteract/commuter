// @flow
const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  router = express.Router();

import type { $Request, $Response } from "express";

function defaultContentTypeMiddleware(req: $Request, res: $Response, next) {
  req.headers["content-type"] =
    req.headers["content-type"] || "application/json";
  next();
}

router.use(defaultContentTypeMiddleware);
router.use(bodyParser.json({ limit: "50mb" })); //50mb is the current threshold
router.use(bodyParser.urlencoded({ extended: true }));

router.use("/ping", (req: $Request, res: $Response) => {
  res.json({ message: "pong" });
});

router.use("/contents", require("./contents"));
router.use("/v1/discovery", require("./v1/discovery"));

module.exports = router;
