const next = require("next");
const dev = process.env.NODE_ENV !== "production";

function createNextApp() {
  const app = next({ dev, dir: __dirname });
  const handle = app.getRequestHandler();

  return {
    app,
    handle
  };
}

module.exports = {
  createNextApp
};
