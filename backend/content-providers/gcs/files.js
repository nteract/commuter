// @flow

const { Storage } = require("@google-cloud/storage");
import type { GoogleStorageProviderOptions } from "./gcs";

const express = require("express");

export function createRouter(config: GoogleStorageProviderOptions): express.Router {
  const router = express.Router();
  const gcs = new Storage();
  router.get("/*", (req: $Request, res: $Response, next: Function) => {
    let key = decodeURIComponent(req.originalUrl.substr(req.baseUrl.length + 1));
    const queryIndex = key.indexOf('?');
    if (queryIndex !== -1) {
      key = key.substr(0, queryIndex);
    }
    if (!key) {
      return res.status(404).send('GCS key is missing.');
    }
    let readStream = gcs.bucket(config.bucket).file(key).createReadStream()
      .on('error', function (err) {
        // If the code is PreconditionFailed and we passed an IfNoneMatch param
        // the object has not changed, so just return a 304 Not Modified response.
        if (err.code === 'NotModified' ||
          (err.code === 'PreconditionFailed' && s3Params.IfNoneMatch)) {
          return res.status(304).end();
        }
        if (err.code === 404) {
          return res.status(404).send(`Not found: ${key}`);
        }
        return next(err);
      });
    readStream.pipe(res);
  });
  return router;
}
