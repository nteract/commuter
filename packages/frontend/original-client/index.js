const { spawn } = require("child_process");

function createClient(args, opts) {
  return new Promise(accept => {
    const process = spawn("npm", args, opts);
    accept(process);
  });
}

module.exports = createClient;
