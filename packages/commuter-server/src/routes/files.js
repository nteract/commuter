// @flow

const express = require("express"),
  config = require("../config"),
  router = express.Router(),
  s3Proxy = require("s3-proxy");

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

module.exports = router;
