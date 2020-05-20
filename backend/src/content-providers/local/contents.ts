import express = require("express");

import * as fs from "./fs";

import { DiskProviderOptions } from "./fs";
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
    const path = params["0"];
    fs.get(options, path)
      .then((content: any) => {
        res.json(content);
      })
      .catch((err: NodeJS.ErrnoException) => {
        const errorResponse: ErrorResponse = {
          message: `${err.message}: ${path}`
        };

        if (err.code === "ENOENT") {
          res.status(404).json(errorResponse);
          return;
        }
        if (err.code === "EACCES") {
          // When unable to access a file, assume 404 in the GitHub security style
          // Even though we're providing all the information in the response...
          res.status(404).json(errorResponse);
          return;
        }

        res.status(500).json(errorResponse);
      });
  });
  router.post("/*", (req: express.Request, res: express.Response) => {
    const params = req.params as ParamsDictionary;
    const path = params["0"];
    fs.post(options, path, req.body)
      .then(() => res.status(201).send())
      .catch((err: NodeJS.ErrnoException) => {
        const errorResponse: ErrorResponse = {
          message: `${err.message}: ${path}`
        };
        res.status(500).json(errorResponse);
      });
  });
  return router;
}
