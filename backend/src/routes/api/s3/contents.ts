import express = require("express");
import S3 = require("aws-sdk/clients/s3");

import { chain } from "lodash";

import { S3StorageConfig } from "../../../config";
import { ParamsDictionary } from "express-serve-static-core";

const isDir = (path?: string | null) => !path || (path && path.endsWith("/"));

const errObject = (err: NodeJS.ErrnoException, path: string) => ({
  message: `${err.message}: ${path}`,
  reason: err.code
});

function createRouter(config: S3StorageConfig): express.Router {
  const router = express.Router();
  const s3 = new S3();

  const fileName = (path: string | undefined): string =>
    chain(path)
      .trimEnd("/")
      .split(config.s3PathDelimiter)
      .last()
      .value() || "";
  const isNotebook = (s3data: any) =>
    s3data.Key && s3data.Key.endsWith("ipynb");

  const dirObject = (bucket: string) => (data: S3.CommonPrefix) => ({
    name: fileName(data.Prefix),
    path: `${bucket}/${data.Prefix}`,
    type: "directory",
    writable: true,
    created: null,
    last_modified: null,
    mimetype: null,
    content: null,
    format: null
  });

  const fileObject = (bucket: string) => (data: {
    Key?: string;
    LastModified?: Date;
  }) => {
    return {
      name: fileName(data.Key),
      path: `${bucket}/${data.Key}`,
      type: isNotebook(data) ? "notebook" : "file",
      writable: true,
      created: null,
      last_modified: data.LastModified,
      mimetype: null,
      content: null,
      format: null
    };
  };

  router.get(
    ["/versions/:bucket/*"],

    (req: express.Request, res: express.Response) => {
      const params = req.params as ParamsDictionary;
      const path = params["0"];
      const cb = (err: NodeJS.ErrnoException, data: any) => {
        if (err) res.status(500).json(errObject(err, path));
        else res.json(data);
      };
      const listObjectVersions = (path: string, callback: Function) => {
        const S3Params = {
          Bucket: params.bucket,
          Prefix: path,
          Delimiter: config.s3PathDelimiter,
          MaxKeys: 2147483647
        };
        s3.listObjectVersions(
          S3Params as S3.ListObjectVersionsRequest,
          (err, data) => {
            if (err || !data) {
              callback(err);
              return;
            }
            if (!data.Versions) {
              callback(new Error("Missing versions from S3 Response"));
              return;
            }
            callback(null, data.Versions);
          }
        );
      };
      listObjectVersions(path, cb);
    }
  );

  router.get(
    ["/:bucket/*", "/:bucket"],
    (req: express.Request, res: express.Response) => {
      const params = req.params as ParamsDictionary;
      const path = params["0"];
      const cb = (err: NodeJS.ErrnoException, data: any) => {
        if (err) res.status(500).json(errObject(err, path));
        else res.json(data);
      };

      const listObjects = (path: string, callback: Function) => {
        const S3Params = {
          Bucket: params.bucket,
          Prefix: path,
          Delimiter: config.s3PathDelimiter, // Maximum allowed by S3 API
          MaxKeys: 2147483647, //remove the folder name from listing
          StartAfter: path
        };
        s3.listObjectsV2(S3Params as S3.ListObjectsV2Request, (err, data) => {
          if (err || !data) {
            callback(err);
            return;
          }
          if (!data.Contents) {
            callback(new Error("Missing contents from S3 Response"));
            return;
          }
          if (!data.CommonPrefixes) {
            callback(new Error("Missing CommonPrefixes from S3 Response"));
            return;
          }
          const files = data.Contents.map(fileObject(params.bucket));
          const dirs = data.CommonPrefixes.map(dirObject(params.bucket));
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
        });
      };

      const getObject = (path: string, callback: Function) => {
        const S3Params = {
          Bucket: params.bucket,
          Key: path,
          ...(req.query.VersionId && { VersionId: req.query.VersionId })
        };
        s3.getObject(S3Params as S3.GetObjectRequest, (err, data) => {
          if (err) {
            callback(err);
            return;
          } else {
            // The Key does not exist on getObject, it's expected to use the path above
            const s3Response = Object.assign({ Body: "" }, data, S3Params);
            let content = s3Response.Body.toString();
            if (isNotebook(s3Response)) {
              try {
                content = JSON.parse(content);
              } catch (err) {
                callback(err);
                return;
              }
            } // Notebook files end up as pure json // All other files end up as pure strings in the content field
            const file = Object.assign(
              {},
              fileObject(params.bucket)(s3Response),
              {
                content
              }
            );
            callback(null, file);
          }
        });
      };

      if (isDir(path)) listObjects(path, cb);
      else {
        getObject(path, (err: NodeJS.ErrnoException, data: any) => {
          if (err && err.code === "NoSuchKey") {
            listObjects(path.replace(/\/?$/, "/"), cb);
            return;
          }

          if (err) res.status(500).json(errObject(err, path));
          else res.json(data);
        });
      }
    }
  );

  return router;
}

export { createRouter, isDir };
