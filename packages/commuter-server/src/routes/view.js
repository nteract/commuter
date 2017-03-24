const express = require("express");

const { isDir } = require("./util");

const Log = require("log"), log = new Log("info");

const path = require("path");

const router = express.Router();

router.get("*", (req, res) => {
  log.info("on the view path");
  if (
    req.path.endsWith(".ipynb") ||
    req.path.endsWith(".html") ||
    req.path.endsWith("/")
  ) {
    res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
  } else {
    // TODO: Include the config.basePath
    const newPath = req.path.replace(/^\//, "/files/");
    res.redirect(newPath);
  }
});

module.exports = router;
