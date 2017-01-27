#!/usr/bin/env node

const args = require("commander"),
  fs = require("fs"),
  path = require("path"),
  createServer = require("commuter-server"),
  createClient = require("commuter-client"),
  Log = require("log"),
  log = new Log("info");

const INSTALL = process.env.NODE_ENV === "production"
  ? "./node_modules"
  : path.resolve(__dirname, "..", "..");

const symlink = (target, path, type = "dir") => {
  return new Promise(accept => {
    fs.symlink(path, target, type, () => {
      log.info(`symlinked target: ${target}  path: ${path}`);
      accept();
    });
  });
};

const startCommuterServer = () => {
  symlink(
    `${INSTALL}/commuter-server/src/build`,
    `${INSTALL}/commuter-client/build`
  )
  .then(createServer)
  .then(server => {
    const port = server.address().port;
    log.info("Commuter server listening on port " + port);
  });
};

const startCommuterClient = () => {
  const command = [ "start" ];
  const processOpts = {
    stdio: "inherit",
    cwd: "node_modules/commuter-client",
    shell: true
  };
  createClient(command, processOpts).then(process => {
    log.info(`Commuter client process pid: ${process.pid}`);
  });
};

args.command("server").action(startCommuterServer);
args.command("client").action(startCommuterClient);
args.parse(process.argv);
