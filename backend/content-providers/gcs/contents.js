// @flow

import type { $Request, $Response } from "express";

import type { GoogleStorageProviderOptions } from "./gcs";

const express = require("express");

const { createGcsService } = require("./gcs");

// TODO: typing here reflects what was put in place before, this could be
// more strict while letting flow do the work vs. the testing of common functions
const isDir = (path?: string | null) => !path || (path && path.endsWith("/"));

const errObject = (err, path) => ({
  message: `${err.message}: ${path}`,
  reason: err.code
});

function createRouter(config: GoogleStorageProviderOptions): express.Router {
  const router = express.Router();
  const gcsService = createGcsService(config);

  router.get("/*", (req: $Request, res: $Response) => {
    const path = req.params["0"];
    const cb = (err, data) => {
      if (err) res.status(500).json(errObject(err, path));
      else res.json(data);
    };
    if (isDir(path)) {
      gcsService.listObjects(path, cb);
    } else {
      gcsService.getObject(path, (err, data) => {
        if (err && err.code === 404) {
          gcsService.listObjects(path.replace(/\/?$/, "/"), cb);
          return;
        }
        if (err) res.status(500).json(errObject(err, path));
        else res.json(data);
      });
    }
  });

  router.post("/*", (req: $Request, res: $Response) => {
    const path = req.params["0"];
    const cb = err => {
      if (err) res.status(500).json(errObject(err, path));
      else res.status(201).send();
    };
    gcsService.uploadObject(path, req.body, cb);
  });

  return router;
}

export { createRouter, isDir };
