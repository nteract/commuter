const {
  COMMUTER_BUCKET = null,
  COMMUTER_PATH_DELIMITER = "/",
  COMMUTER_BASEPATH = null,
  COMMUTER_PORT = 4000,
  NODE_ENV = "test"
} = process.env;

const config = {
  s3: {
    params: {
      // required bucket name
      Bucket: COMMUTER_BUCKET
    }
  },
  pathDelimiter: COMMUTER_PATH_DELIMITER,
  basePath: COMMUTER_BASEPATH,
  nodeEnv: NODE_ENV,
  port: COMMUTER_PORT
};

module.exports = config;
