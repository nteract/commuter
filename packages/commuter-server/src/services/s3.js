const config = require("../config"),
  S3 = require("aws-sdk/clients/s3"),
  _ = require("lodash");

const s3 = new S3(config.s3);

const fileName = path =>
  _.chain(path).trimEnd("/").split(config.pathDelimiter).last().value();
const filePath = path =>
  config.basePath ? path.replace(`${config.basePath}`, "") : path;
const s3Prefix = path => config.basePath ? `${config.basePath}/${path}` : path;

const dirObject = data =>
  ({
    name: fileName(data.Prefix),
    path: filePath(data.Prefix),
    type: "directory",
    writable: true,
    created: null,
    last_modified: null,
    mimetype: null,
    content: null,
    format: null
  });

const fileObject = data =>
  ({
    name: fileName(data.Key),
    path: filePath(data.Key),
    type: data.Key.endsWith("ipynb") ? "notebook" : "file",
    writable: true,
    created: null,
    last_modified: data.LastModified,
    mimetype: null,
    content: null,
    format: null
  });

exports.listObjects = (path, callback) => {
  const params = {
    Prefix: s3Prefix(path),
    Delimiter: config.pathDelimiter,
    // Maximum allowed by S3 API
    MaxKeys: 2147483647
  };
  s3.listObjects(params, (err, data) => {
    if (err)
      callback(err);
    else {
      const files = data.Contents.map(fileObject);
      const dirs = data.CommonPrefixes.map(dirObject);
      callback(null, {
        name: fileName(path),
        path: path,
        type: "directory",
        writable: true,
        created: null,
        last_modified: null,
        mimetype: null,
        content: [ ...files, ...dirs ],
        format: "json"
      });
    }
  });
};

exports.getObject = (path, callback) => {
  s3.getObject({ Key: s3Prefix(path) }, (err, data) => {
    if (err)
      callback(err);
    else
      callback(null, JSON.parse(data.Body)); // Buffer to string
  });
};
