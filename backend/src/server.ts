import express from "express";

import { createNextApp } from "../../frontend";

import { parse } from "url";

import * as http from "http";

const path = require("path"),
  morgan = require("morgan"),
  config = require("./config"),
  Log = require("log"),
  log = new Log("info");

import { ParamsDictionary } from "express-serve-static-core";

export async function createServer(): Promise<http.Server> {
  const frontend = createNextApp();

  // Wait for the next.js handlers to be ready
  await frontend.prepare();

  const app = express();
  app.use(morgan("common"));

  log.info(`Node env: ${config.nodeEnv}`);

  const router = require("./routes");

  /**
   *
   * /view/ router
   *
   * On some filetypes it will serve the next.js app and on others it will
   * redirect to the literal file. This is to allow for resolving relative
   * assets like images within notebooks.
   */
  const suffixRegex = /(?:\.([^.]+))?$/;
  const renderSuffixes = new Set(["ipynb", "html", "json", "md", "rmd"]);
  const renderAccepts = new Set(["text/html", "application/xhtml+xml"]);
  const generateViewHandler = (handlerPath: string, fallbackPath: string) => {
    const viewHandler = (req: express.Request, res: express.Response) => {
      const presuffix = suffixRegex.exec(req.path);

      if (!presuffix) {
        return null;
      }

      const suffix = (presuffix[1] || "").toLowerCase();
      const accepts = (req.headers.accept || "").split(",");

      if (
        // If one of our suffixes is a renderable item
        renderSuffixes.has(suffix) ||
        // If the file is requested as `text/html` first and foremost, we'll also
        // render our file viewer
        renderAccepts.has(accepts[0]) ||
        renderAccepts.has(accepts[1])
      ) {
        const params = req.params as ParamsDictionary;
        const { pathname, query } = parse(req.url, true);
        const viewPath = params["0"] || "/";
        const q = Object.assign({}, { viewPath }, query);
        return frontend.render(req, res, `/${handlerPath}`, q);
      }

      const newPath = req.path.replace(
        RegExp(`^/${handlerPath}`),
        `/${fallbackPath}`
      );
      res.redirect(newPath);
      return;
    };
    return viewHandler;
  };

  /**
   * Express middleware for letting our next.js frontend do the handling
   */
  const passToNext = (req: express.Request, res: express.Response) => {
    return frontend.getRequestHandler()(req, res);
  };
  const viewHandler = generateViewHandler("view", "files");
  const s3ViewHandler = generateViewHandler("s3-view", "s3-files");
  const s3BasePathRedirect = (req: express.Request, res: express.Response) => {
    res.redirect(`/s3-view/${config.s3storage.s3.params.Bucket}`);
  };
  const s3ArtifactRedirectHandler = (
    req: express.Request,
    res: express.Response
  ) => {
    res.redirect(
      `/s3-view/${config.s3storage.s3.params.Bucket}/${config.s3storage.artifactPrefix}`
    );
  };

  router.get(["/s3-view", "/s3-view/"], s3BasePathRedirect);
  router.get(["/s3-artifacts", "/s3-artifacts/"], s3ArtifactRedirectHandler);

  router.get(["/view", "/view*"], viewHandler);
  router.get(["/s3-view*"], s3ViewHandler);
  router.get("*", passToNext);

  // TODO: Leaving this here for the eventual baseURL handling
  const baseURI = "/";
  app.use(baseURI, router);
  app.use(passToNext);

  const server = http.createServer(app);

  return new Promise(accept => {
    server.listen(config.port, () => accept(server));
  });
}
