const {
  COMMUTER_BUCKET = null,
  COMMUTER_PATH_DELIMITER = "/",
  COMMUTER_BASEPATH = null,
  COMMUTER_PORT = 4000,
  PORT,
  NODE_ENV = "test",
  COMMUTER_S3_KEY,
  COMMUTER_S3_SECRET
} = process.env;

const config = {
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
  pathDelimiter: COMMUTER_PATH_DELIMITER,
  basePath: COMMUTER_BASEPATH,
  nodeEnv: NODE_ENV,
  port: PORT || COMMUTER_PORT
};

module.exports = config;
