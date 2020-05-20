// Note: this module must remain compatible with the ECMAScript version of the
// Server as it does _not_ get transpiled
// The reason being that it makes resolving pages/ and other bits for the frontend
// server work out-of-the-box instead of having a bunch of custom work on `next`
const next = require("next");
const dev = process.env.NODE_ENV !== "production" && !process.env.NOW;

function createNextApp() {
  const app = next({ dev, dir: __dirname });
  return app;
}

module.exports = {
  createNextApp
};
