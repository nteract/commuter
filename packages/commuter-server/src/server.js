const express = require("express"),
  http = require("http"),
  path = require("path"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  config = require("./config"),
  Log = require("log"),
  log = new Log("info");

function defaultContentTypeMiddleware(req, res, next) {
  req.headers["content-type"] = req.headers["content-type"] ||
    "application/json";
  next();
}

function createServer() {
  const app = express();
  app.use(morgan("common"));
  app.use(defaultContentTypeMiddleware);
  app.use(bodyParser.json({ limit: "50mb" })); //50mb is the current threshold
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static("static"));

  log.info(`Node env: ${config.nodeEnv}`);

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
