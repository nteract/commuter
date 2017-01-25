const express = require("express"),
  router = express.Router(),
  listObjects = require("./../services/s3").listObjects,
  getObject = require("./../services/s3").getObject,
  isDir = require("./util").isDir;

const errObject = (err, path) =>
  ({ message: `${err.message}: ${path}`, reason: err.code });

router.get("/*", (req, res) => {
  const path = req.params["0"];
  const cb = (err, data) => {
    if (err)
      res.status(err.statusCode).json(errObject(err, path));
    else
      res.json(data);
  };
  if (isDir(path))
    listObjects(path, cb);
  else
    getObject(path, cb);
});

module.exports = router;
