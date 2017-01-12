const { COMMUTER_BUCKET = null, COMMUTER_PATH_DELIMITER = "/", COMMUTER_BASEPATH = null } = process.env;

const config = {
  s3: {
    params: {
      // required bucket name
      Bucket: COMMUTER_BUCKET
    }
  },
  pathDelimiter: COMMUTER_PATH_DELIMITER,
  basePath: COMMUTER_BASEPATH
};

module.exports = config;
