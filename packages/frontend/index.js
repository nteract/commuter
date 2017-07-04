const next = require("next");
const dev = process.env.NODE_ENV !== "production";

const { JSDOM } = require("jsdom");

global.fakedom = new JSDOM("");
global.document = global.fakedom.window.document;
global.window = global.fakedom.window;
global.navigator = "gecko";

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
