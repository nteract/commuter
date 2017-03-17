const express = require("express");
const next = require("next");

// TODO: Use the commuter config
const config = {
  port: 3000
};

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();
  // API server via express
  server.get("/api*", (req, res) => {
    res.send("files");
  });
  // Direct /files/ endpoint via express
  server.get("/files*", (req, res) => {
    res.send("hey");
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
