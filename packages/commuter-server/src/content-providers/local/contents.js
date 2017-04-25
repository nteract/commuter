// @flow
const express = require("express");

const fs = require("./fs");

import type { DiskProviderOptions } from "./fs";

import type { $Request, $Response } from "express";

type ErrorResponse = {
  message: string
};

function createRouter(options: DiskProviderOptions) {
  if (!options.local.baseDirectory) {
    throw new Error("Base directory must be specified for the local provider");
  }
  const router = express.Router();
  router.get("/*", (req: $Request, res: $Response) => {
    const path = req.params["0"];
    fs
      .get(options, path)
      .then(content => {
        res.json(content);
      })
      .catch((err: Error) => {
        const errorResponse: ErrorResponse = {
          message: `${err.message}: ${path}`
        };
        res.status(500).json();
      });
  });
  return router;
}
module.exports = {
  createRouter
};
