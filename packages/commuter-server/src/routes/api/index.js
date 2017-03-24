const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  router = express.Router();

function defaultContentTypeMiddleware(req, res, next) {
  req.headers["content-type"] = req.headers["content-type"] ||
    "application/json";
  next();
}

router.use(defaultContentTypeMiddleware);
router.use(bodyParser.json({ limit: "50mb" })); //50mb is the current threshold
router.use(bodyParser.urlencoded({ extended: true }));

router.use("/ping", (req, res) => {
  res.json({ message: "pong" });
});

router.use("/contents", require("./contents"));
router.use("/v1/discovery", require("./v1/discovery"));

module.exports = router;
