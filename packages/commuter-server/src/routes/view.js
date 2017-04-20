// @flow

import type { $Request, $Response } from "express";

const express = require("express");

const { isDir } = require("./util");

const Log = require("log"), log = new Log("info");

const path = require("path");

const router = express.Router();

const suffixRegex = /(?:\.([^.]+))?$/;

const renderSuffixes = new Set(["ipynb", "html", "json", "md", "rmd"]);
const renderAccepts = new Set(["text/html", "application/xhtml+xml"]);

router.get("*", (req: $Request, res: $Response) => {
  const suffix = (suffixRegex.exec(req.path)[1] || "").toLowerCase();
  const accepts = (req.headers.accept || "").split(",");

  if (
    // If one of our suffixes is a renderable item
    renderSuffixes.has(suffix) ||
    // If the file is requested as `text/html` first and foremost, we'll also
    // render our file viewer
    renderAccepts.has(accepts[0]) ||
    renderAccepts.has(accepts[1])
  ) {
    res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
    return;
  }

  // TODO: Include the config.basePath
  const newPath = req.path.replace(/^\//, "/files/");
  res.redirect(newPath);
  return;
});

module.exports = router;
