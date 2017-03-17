const express = require("express");
const next = require("next");

const config = require("./services/config");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const router = express.Router();
  const server = express();

  server.use(router);

  // API server via express
  router.use("/api/contents", require("./routes/contents"));
  router.use("/api/v1/discovery", require("./routes/discovery"));
  // Direct /files/ endpoint via express
  router.use("/files", require("./routes/files"));

  // TODO: redirect when /view/ is not .ipynb or .html

  // All else is done with next.js
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(config.port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${config.port}`);
  });
});
