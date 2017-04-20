// @flow
const express = require("express");

const fs = require("fs");
const path = require("path");

const sanitizeFilePath = require("./fs").sanitizeFilePath;
import type { DiskProviderOptions } from "./fs";

import type { $Request, $Response } from "express";

type ErrorResponse = {
  message: string
};

function createRouter(options: DiskProviderOptions) {
  if (!options.baseDirectory) {
    throw new Error("Base directory must be specified for the local provider");
  }

  const router = express.Router();

  router.get("/*", (req: $Request, res: $Response) => {
    const unsafeFilePath = req.params["0"];

    const filePath = path.join(
      options.baseDirectory,
      sanitizeFilePath(unsafeFilePath)
    );

    fs.createReadStream(filePath).pipe(res);
  });
  return router;
}

module.exports = {
  createRouter
};
