// @flow
const express = require("express");

const fs = require("fs");
const path = require("path");

const sanitizeFilePath = require("./fs").sanitizeFilePath;
import type { DiskProviderOptions } from "./fs";

import type { $Request, $Response } from "express";

type ErrorResponse = {
  message: string
};

function createRouter(options: DiskProviderOptions) {
  if (!options.local.baseDirectory) {
    throw new Error("Base directory must be specified for the local provider");
  }

  return express.static(options.local.baseDirectory);
}

module.exports = {
  createRouter
};
