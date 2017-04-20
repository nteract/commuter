// @flow
const config = require("../config"),
  S3 = require("aws-sdk/clients/s3"),
  { chain } = require("lodash");

const s3 = new S3(config.s3);

const fileName = path =>
  chain(path).trimEnd("/").split(config.pathDelimiter).last().value();
const filePath = path =>
  (config.basePath ? path.replace(`${config.basePath}`, "") : `/${path}`);
const s3Prefix = path =>
  (config.basePath ? `${config.basePath}/${path}` : path);

const dirObject = data => ({
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

const isNotebook = s3data => s3data.Key.endsWith("ipynb");

const fileObject = data => ({
  name: fileName(data.Key),
  path: filePath(data.Key),
  type: isNotebook(data) ? "notebook" : "file",
  writable: true,
  created: null,
  last_modified: data.LastModified,
  mimetype: null,
  content: null,
  format: null
});

const listObjects = (path: string, callback: Function) => {
  const params = {
    Prefix: s3Prefix(path),
    Delimiter: config.pathDelimiter,
    // Maximum allowed by S3 API
    MaxKeys: 2147483647,
    //remove the folder name from listing
    StartAfter: s3Prefix(path)
  };
  s3.listObjectsV2(params, (err, data) => {
    if (err) callback(err);
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
        content: [...files, ...dirs],
        format: "json"
      });
    }
  });
};

const getObject = (path: string, callback: Function) => {
  s3.getObject({ Key: s3Prefix(path) }, (err, data) => {
    if (err) {
      callback(err);
      return;
    } else {
      // The Key does not exist on getObject, it's expected to use the path above
      const s3Response = Object.assign({}, data, { Key: s3Prefix(path) });

      let content = s3Response.Body.toString("utf-8");

      if (isNotebook(s3Response)) {
        try {
          content = JSON.parse(content);
        } catch (err) {
          callback(err);
          return;
        }
      }

      // Notebook files end up as pure json
      // All other files end up as pure strings in the content field
      const file = Object.assign({}, fileObject(s3Response), {
        content
      });

      callback(null, file);
    }
  });
};

const deleteObject = (path: string, callback: Function) => {
  s3.deleteObject({ Key: s3Prefix(path) }, (err, data) => {
    if (err) callback(err);
    else callback(null, data);
  });
};

const deleteObjects = (path: string, callback: Function) => {
  let objects = [{ Key: s3Prefix(path) }];
  let callStack = 1;

  const getObjects = path => {
    return new Promise((resolve, reject) => {
      listObjects(path, (err, data) => {
        if (err) {
          reject(err);
        }
        if (!data.content) {
          reject(err);
        }

        callStack -= 1;
        data.content.forEach(o => {
          if (o.type == "directory") {
            callStack += 1; //recurse
            getObjects(o.path.substr(1)).then(() => resolve());
          } else objects.push({ Key: s3Prefix(o.path.substr(1)) });
        });
        if (callStack == 0) resolve(); // notify end
      });
    });
  };

  const s3Delete = () => {
    s3.deleteObjects(
      {
        Delete: { Objects: objects, Quiet: true }
      },
      (err, data) => {
        if (err) callback(err);
        else callback(null, data);
      }
    );
  };

  getObjects(path).then(s3Delete);
};

const uploadObject = (path: string, body: mixed, callback: Function) => {
  s3.upload(
    {
      Key: s3Prefix(path),
      Body: JSON.stringify(body)
    },
    (err, data) => {
      if (err) callback(err);
      else callback(null, data);
    }
  );
};

module.exports = {
  listObjects,
  getObject,
  deleteObject,
  deleteObjects,
  uploadObject
};
