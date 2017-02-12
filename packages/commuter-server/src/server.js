const express = require("express"),
  http = require("http"),
  path = require("path"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  config = require("./config"),
  Log = require("log"),
  log = new Log("info");

function createServer() {
  const app = express();
  app.use(morgan("common"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  log.info(`Node env: ${config.nodeEnv}`);
  if (config.nodeEnv === "production")
    app.use(
      "/nteract/commuter",
      express.static(path.resolve(__dirname, "..", "build"))
    );
  if (!config.s3.params.Bucket) {
    log.error("S3 bucket name missing!!");
    process.exit(1);
  }
  // Last middleware
  app.use(require("./routes"));

  const server = http.createServer(app);

  return new Promise(accept => {
    server.listen(config.port, () => {
      accept(server);
    });
  });
}

module.exports = createServer;
