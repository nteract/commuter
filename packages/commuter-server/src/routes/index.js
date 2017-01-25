const express = require("express"), router = express.Router();

router.use("/api/contents", require("./contents"));

module.exports = router;
