const express = require("express");
const next = require("next");

const config = {
  port: 3000
};

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();

  server.get("/api", (req, res) => {
    res.send("hey");
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(config.port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${config.port}`);
  });
});
