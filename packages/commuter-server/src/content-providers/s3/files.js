// @flow

const express = require("express"),
  config = require("../../config"),
  s3Proxy = require("s3-proxy");

// TODO: Get away from singleton config
// This is currently impure, however that will have to be fixed up later to
// fully adapt to the functional interface
function createRouter(): express.Router {
  const router = express.Router();

  router.get(
    "/*",
    s3Proxy({
      bucket: config.s3.params.Bucket,
      prefix: config.s3BasePrefix,
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
      overrideCacheControl: "max-age=100000"
    })
  );
  return router;
}

module.exports = {
  createRouter
};
