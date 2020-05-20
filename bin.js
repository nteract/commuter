#!/usr/bin/env node

process.env.NODE_ENV = "production";

require("./backend/dist/index.js");
