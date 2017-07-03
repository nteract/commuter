const next = require("next");
const dev = process.env.NODE_ENV !== "production";

console.log(__dirname);

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
