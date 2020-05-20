import express = require("express");

import bodyParser = require("body-parser");

// Sadly because of the singleton + export we're stuck with a classic require here
const config = require("../../config");

const defaultContentTypeMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  req.headers["content-type"] =
    req.headers["content-type"] || "application/json";
  next();
};

type APIRouters = {
  contents: express.Router;
  s3contents: express.Router;
};

function createAPIRouter(api: APIRouters): express.Router {
  const router = express.Router();
  router.use(defaultContentTypeMiddleware);
  router.use(bodyParser.json({ limit: "50mb" })); //50mb is the current threshold
  router.use(bodyParser.urlencoded({ extended: true }));

  router.use("/ping", (req: express.Request, res: express.Response) => {
    res.json({ message: "pong" });
  });

  router.use("/contents", api.contents);
  router.use("/s3-contents", api.s3contents);
  router.use("/s3-clone", function(req, res) {
    const { s3Bucket, s3Key, versionId } = req.body;
    if (config.clone_server_endpoint === null) {
      res.status(400).json({
        message:
          "No backend configured for cloning. /api/s3-clone is not available"
      });
      return;
    }
    let notebookServerEndpoint = config.clone_server_endpoint;
    const bookstoreCloneEndpoint = "/bookstore/clone";
    let bduser = req.headers["bd-preferred-username"];
    if (bduser) {
      notebookServerEndpoint += `/${bduser}/ipynb`;
    }
    const queryString = `?s3_bucket=${s3Bucket}&s3_key=${s3Key}${
      versionId ? "&s3_version_id=" + versionId : ""
    }`;
    res.json({
      url: `${notebookServerEndpoint}${bookstoreCloneEndpoint}${queryString}`
    });

    return;
  });
  router.use("/clone", function(req, res) {
    const { relpath } = req.body;
    if (config.clone_server_endpoint === null) {
      res.status(400).json({
        message:
          "No backend configured for cloning. /api/clone is not available"
      });
      return;
    }
    let notebookServerEndpoint = config.clone_server_endpoint;
    const bookstoreCloneEndpoint = "/bookstore/fs-clone";
    let bduser = req.headers["bd-preferred-username"];
    if (bduser) {
      notebookServerEndpoint += `/${bduser}/ipynb`;
    }
    res.json({
      url: `${notebookServerEndpoint}${bookstoreCloneEndpoint}?relpath=${relpath}`
    });

    return;
  });
  return router;
}

module.exports = createAPIRouter;
