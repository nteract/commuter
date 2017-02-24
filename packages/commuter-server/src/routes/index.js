const express = require("express"),
  path = require("path"),
  router = express.Router();

router.use("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

router.use("/api/contents", require("./contents"));
router.use("/api/v1/discovery", require("./discovery"));

//commuter-client
router.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
});

module.exports = router;
