const express = require("express"), router = express.Router();

router.use("/api/contents", require("./contents"));

router.get("/", (req, res) => {
  res.json({ "root": true });
});

module.exports = router;
