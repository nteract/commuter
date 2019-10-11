// @flow
const { Storage } = require("@google-cloud/storage"),
  { chain } = require("lodash");

export type GoogleStorageProviderOptions = {
  bucket: string,
  pathDelimiter: string,
  basePrefix?: string,
};

function createGcsService(config: GoogleStorageProviderOptions) {
  const gcs = new Storage();

  const fileName = (path: string): string =>
    chain(path)
      .trimEnd("/")
      .split(config.pathDelimiter)
      .last()
      .value();
  const filePath = (path: string) =>
    path
      .replace(`${config.basePrefix}`, "")
      .replace(/^\//, "");
  const gcsPrefix = (path: string) =>
    config.basePrefix ? `${config.basePrefix}/${path}` : path;
  const dirObject = prefix => ({
    name: fileName(prefix),
    path: filePath(prefix),
    type: "directory",
    writable: true,
    created: null,
    last_modified: null,
    mimetype: null,
    content: null,
    format: null
  });
  const isNotebook = s3data => s3data.Key && s3data.Key.endsWith("ipynb");
  const fileObject = data => ({
    name: fileName(data.name),
    path: filePath(data.name),
    type: isNotebook(data) ? "notebook" : "file",
    writable: true,
    created: null,
    last_modified: data.LastModified,
    mimetype: null,
    content: null,
    format: null
  });
  const listObjects = (path: string, callback: Function) => {
    const query = {
      prefix: gcsPrefix(path),
      delimiter: config.pathDelimiter,
      autoPaginate: false,
    };
    const dirs = [],
      files = [],
      bucket = gcs.bucket(config.bucket);
    const cb = (err, data, next, res) => {
      if (res.prefixes) dirs.push(...res.prefixes.map(dirObject));
      if (data) files.push(...data.map(fileObject));
      if (next) {
        bucket.getFiles(next, cb);
      } else {
        callback(null, {
          name: fileName(path),
          path: path,
          type: "directory",
          writable: true,
          created: null,
          last_modified: null,
          mimetype: null,
          content: [...files, ...dirs],
          format: "json"
        });
      }
    };
    bucket.getFiles(query, cb);
  };
  const getObject = (path: string, callback: Function) => {
    gcs.bucket(config.bucket).file(gcsPrefix(path)).get({}, (err, file) => {
      if (err) {
        callback(err);
        return;
      }
      file.download({}, (err, body) => {
        if (err) {
          callback(err);
          return;
        }
        let content = body.toString();
        if (isNotebook(file)) {
          try {
            content = JSON.parse(content);
          } catch (err) {
            callback(err);
            return;
          }
        }
        const ret = Object.assign({}, fileObject(file), {
          content
        });
        callback(null, ret);
      });
    });
  };
  const uploadObject = (path: string, body: mixed, callback: Function) => {
    gcs.bucket(config.bucket).file(path).save(JSON.stringify(body), null, (err, data) => {
      if (err) callback(err);
      else callback(null, data);
    });
  };
  return {
    listObjects,
    getObject,
    uploadObject
  };
}

export { createGcsService };
