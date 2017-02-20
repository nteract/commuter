#!/usr/bin/env node

const args = require("commander"),
  isProduction = process.env.NODE_ENV === "production",
  COMMUTER_SERVER = "@nteract/commuter-server",
  COMMUTER_CLIENT = "@nteract/commuter-client",
  COMMUTER_SERVER_DIR = isProduction ? `${COMMUTER_SERVER}` : "commuter-server",
  COMMUTER_CLIENT_DIR = isProduction ? `${COMMUTER_CLIENT}` : "commuter-client",
  fs = require("fs"),
  copydir = require("copy-dir"),
  path = require("path"),
  createServer = require(`${COMMUTER_SERVER}`),
  createClient = require(`${COMMUTER_CLIENT}`),
  Log = require("log"),
  log = new Log("info");

const INSTALL_DIR = isProduction
  ? "./node_modules"
  : path.resolve(__dirname, "..", "..");

const symlink = (target, path, type = "dir") => {
  return new Promise(accept => {
    fs.symlink(target, path, type, () => {
      log.info(`symlinked target: ${target} to path: ${path}`);
      accept();
    });
  });
};

const copyDir = (from, to) => {
  return new Promise(accept => {
    copydir(from, to, () => {
      log.info(`Copied from: ${from} to: ${to}`);
      accept();
    });
  });
};

const startCommuterServer = () => {
  copyDir(
    `${INSTALL_DIR}/${COMMUTER_CLIENT_DIR}/build`,
    `${INSTALL_DIR}/${COMMUTER_SERVER_DIR}/build`
  )
    .then(createServer)
    .then(server => {
      const port = server.address().port;
      log.info("Commuter server listening on port " + port);
    });
};

const startCommuterClient = () => {
  const command = ["start"];
  const processOpts = {
    stdio: "inherit",
    cwd: `node_modules/${COMMUTER_CLIENT}`,
    shell: true
  };
  createClient(command, processOpts).then(process => {
    log.info(`Commuter client process pid: ${process.pid}`);
  });
};

args.command("server").action(startCommuterServer);
args.command("client").action(startCommuterClient);
args.parse(process.argv);
