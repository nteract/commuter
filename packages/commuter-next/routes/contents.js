const express = require("express"),
  router = express.Router(),
  { isDir } = require("./util"),
  {
    listObjects,
    getObject,
    deleteObject,
    deleteObjects,
    uploadObject
  } = require("./../services/s3");

const errObject = (err, path) => ({
  message: `${err.message}: ${path}`,
  reason: err.code
});

router.get("/*", (req, res) => {
  const path = req.params["0"];
  const cb = (err, data) => {
    if (err) res.status(500).json(errObject(err, path));
    else res.json(data);
  };
  if (isDir(path)) listObjects(path, cb);
  else getObject(path, cb);
});

router.delete("/*", (req, res) => {
  const path = req.params["0"];
  const cb = (err, data) => {
    if (err) res.status(500).json(errObject(err, path));
    else res.status(204).send(); //as per jupyter contents api
  };
  if (isDir(path)) deleteObjects(path, cb);
  else deleteObject(path, cb);
});

router.post("/*", (req, res) => {
  const path = req.params["0"];
  const cb = (err, data) => {
    if (err) res.status(500).json(errObject(err, path));
    else res.status(201).send();
  };
  uploadObject(path, req.body, cb);
});

module.exports = router;
