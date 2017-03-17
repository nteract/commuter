const express = require("express"),
  router = express.Router(),
  { list } = require("./../services/elasticSearch");

router.get("/*", (req, res) => {
  const successCb = data => res.json(data);
  const errorCb = err =>
    res.status(err.statusCode).json({ message: err.message });
  list(successCb, errorCb);
});

module.exports = router;
