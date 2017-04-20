// @flow

import type { $Request, $Response } from "express";

const express = require("express"),
  router = express.Router(),
  { list } = require("./../../../services/elasticSearch");

router.get("/*", (req: $Request, res: $Response) => {
  const successCb = data => res.json(data);
  const errorCb = err =>
    res.status(err.statusCode).json({ message: err.message });
  list(successCb, errorCb);
});

module.exports = router;
