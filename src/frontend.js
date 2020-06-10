// Note: this module must remain compatible with the ECMAScript version of the
// Server as it does _not_ get transpiled
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production" && !process.env.NOW;

function createNextApp() {
  const app = next({ dev, dir: path.join(__dirname, "..") });
  const handle = app.getRequestHandler();

  return {
    app,
    handle
  };
}

module.exports = {
  createNextApp
};
