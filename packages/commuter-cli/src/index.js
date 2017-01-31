#!/usr/bin/env node

const args = require("commander"),
  COMMUTER_SERVER = "@nteract/commuter-server",
  COMMUTER_CLIENT = "@nteract/commuter-client",
  fs = require("fs"),
  path = require("path"),
  createServer = require(`${COMMUTER_SERVER}`),
  createClient = require(`${COMMUTER_CLIENT}`),
  Log = require("log"),
  log = new Log("info");

const INSTALL_DIR = process.env.NODE_ENV === "production"
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
    `${INSTALL_DIR}/${COMMUTER_SERVER}/src/build`,
    `${INSTALL_DIR}/${COMMUTER_CLIENT}/build`
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
