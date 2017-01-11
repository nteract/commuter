const { bucket = null, pathDelimiter = "/", basePath = null } = process.env;

const config = {
  s3: {
    params: {
      // required bucket name
      Bucket: bucket
    }
  },
  pathDelimiter: pathDelimiter,
  basePath: basePath
};

module.exports = config;
