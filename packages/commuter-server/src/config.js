// @flow

const {
  COMMUTER_BUCKET = null,
  COMMUTER_PATH_DELIMITER,
  COMMUTER_BASEPATH = "",
  COMMUTER_PORT = 4000,
  COMMUTER_S3_BASE_PREFIX = "",
  PORT,
  NODE_ENV,
  COMMUTER_S3_KEY,
  COMMUTER_S3_SECRET,
  COMMUTER_ES_HOST
} = process.env;

function deprecate(oldVar, newVar) {
  if (process.env[oldVar]) {
    console.warn(`${oldVar} is deprecated, please use ${newVar}`);
  }
}

deprecate("COMMUTER_BASEPATH", "COMMUTER_S3_BASE_PREFIX");
deprecate("COMMUTER_PATH_DELIMITER", "COMMUTER_S3_PATH_DELIMITER");

const s3PathDelimiter =
  process.env.COMMUTER_S3_PATH_DELIMITER ||
  process.env.COMMUTER_PATH_DELIMITER ||
  "/";

const s3BasePrefix = (process.env.COMMUTER_S3_BASE_PREFIX ||
process.env.COMMUTER_BASEPATH || // deprecated
  "")
  // trim off trailing slashes
  .replace(/\/+$/, "");

module.exports = {
  s3: {
    params: {
      // required s3 bucket name
      Bucket: COMMUTER_BUCKET
    },
    // required key
    accessKeyId: COMMUTER_S3_KEY,
    // required secret
    secretAccessKey: COMMUTER_S3_SECRET
  },
  elasticSearch: {
    host: COMMUTER_ES_HOST,
    log: "debug"
  },
  // TODO: These should both be named in the s3 namespace
  s3PathDelimiter,
  s3BasePrefix,

  nodeEnv: NODE_ENV || "test",
  port: PORT || COMMUTER_PORT
};
