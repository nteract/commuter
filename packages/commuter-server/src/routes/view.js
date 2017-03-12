const express = require("express");
const { isDir } = require('./util');

const  Log = require("log"),
  log = new Log("info");

const router = express.Router();

router.get("*", (req, res) => {
  const path = req.path;
  log.info('on the view path');
  if (path.endsWith(".ipynb") || path.endsWith(".html") || path.endsWith("/")) {
    res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
  } else {
    // TODO: Include the config.basePath
    const newPath = path.replace(/^\/view\//, '/files/');
    res.redirect(newPath);
  }
});

module.exports = router;
