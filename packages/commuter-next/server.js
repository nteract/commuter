const express = require("express");
const next = require("next");
const Log = require("log");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const path = require("path");

const log = new Log("info");

const config = require("./services/config");

if (!config.s3.params.Bucket) {
  throw new Error("S3 bucket name missing");
}

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

function defaultContentTypeMiddleware(req, res, next) {
  req.headers["content-type"] = req.headers["content-type"] ||
    "application/json";
  next();
}

/**
 * Prepares the API + /files/ endpoints
 * @return {express.Server}
 */
function prepareExpressServer() {
  const router = express.Router();
  const server = express();

  server.use(favicon(path.join(__dirname, "static", "favicon.ico")));

  server.use(morgan("common"));
  server.use(defaultContentTypeMiddleware);
  server.use(bodyParser.json({ limit: "50mb" })); //50mb is the current threshold
  server.use(bodyParser.urlencoded({ extended: true }));

  // API server via express
  router.use("/api/contents", require("./routes/contents"));
  router.use("/api/v1/discovery", require("./routes/discovery"));
  router.use("/api/ping", (req, res) => {
    res.json({ message: "pong" });
  });
  // Direct /files/ endpoint via express
  router.use("/files", require("./routes/files"));

  server.use(router);

  // TODO: redirect when /view/ is not .ipynb or .html
  return server;
}

nextApp.prepare().then(() => {
  // API server and /files/ endpoints served by express
  const server = prepareExpressServer();

  server.get("/view*", (req, res) => {
    return nextApp.render(req, res, "/view");
  });

  // All else is done with next.js
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(config.port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${config.port}`);
  });
});
