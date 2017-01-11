const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  config = require("./config"),
  Log = require("log"),
  log = new Log("info"),
  port = process.env.port || 3000;

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("./routes"));

if (!config.s3.params.Bucket) {
  log.error("S3 bucket name missing!!");
  process.exit(1);
}

module.exports = app.listen(port, () => {
  log.info("Listening on port " + port);
});
