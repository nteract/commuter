import express = require("express");

import * as fs from "fs";
import * as path from "path";

import { sanitizeFilePath, DiskProviderOptions } from "./fs";
import { ParamsDictionary } from "express-serve-static-core";
type ErrorResponse = {
  message: string;
};

export function createRouter(options: DiskProviderOptions) {
  if (!options.local.baseDirectory) {
    throw new Error("Base directory must be specified for the local provider");
  }

  const router = express.Router();

  router.get("/*", (req: express.Request, res: express.Response) => {
    const params = req.params as ParamsDictionary;
    const unsafeFilePath = params["0"];

    const filePath = path.join(
      options.local.baseDirectory,
      sanitizeFilePath(unsafeFilePath)
    );

    // Assume it's a file by default, fall to error handling otherwise
    const rs = fs.createReadStream(filePath);

    rs.on("error", (err: NodeJS.ErrnoException) => {
      const errorResponse: ErrorResponse = {
        message: `${err.message}: ${filePath}`
      };

      if (err.code === "ENOENT" || err.code === "EACCES") {
        res.status(404).send(errorResponse);
        return;
      }

      console.error(err.stack);
      res.status(500).send(errorResponse);
    });

    rs.pipe(res);
  });
  return router;
}
