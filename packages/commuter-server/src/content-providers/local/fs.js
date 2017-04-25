// @flow

/**
 * Local storage provider for commuter
 */

const fs = require("fs");
const path = require("path");

import type {
  Content,
  DirectoryContent,
  FileContent,
  NotebookContent
} from "../base";

export type DiskProviderOptions = {
  local: {
    baseDirectory: string
  }
};

/**
 * Convert a single dot or slash to ''
 *
 * This is for conforming to the Jupyter contents API for the `/` endpoint
 */
function cleanBaseDir(s: string) {
  if (s === "." || s === "/") {
    return "";
  }
  return s;
}

function createContentResponse(
  parsedFilePath: {
    root: string,
    dir: string,
    base: string,
    ext: string,
    name: string
  },
  stat: fs.Stats
): Content {
  const name = cleanBaseDir(parsedFilePath.base);
  const filePath = cleanBaseDir(
    path.join(parsedFilePath.dir, parsedFilePath.base)
  );
  const writable = Boolean(fs.constants.W_OK & stat.mode);
  // $FlowFixMe: See https://github.com/facebook/flow/pull/3767
  const created: Date = stat.birthtime;
  const last_modified = stat.mtime;

  if (stat.isDirectory()) {
    return {
      type: "directory",
      mimetype: null,
      format: "json",
      content: null,
      writable: true,
      name: name === "." ? "" : name,
      path: filePath === "." ? "" : filePath,
      created,
      last_modified
    };
  } else if (stat.isFile()) {
    // TODO: Handle notebook differently
    if (parsedFilePath.ext === ".ipynb") {
      return {
        type: "notebook",
        mimetype: null,
        format: "json",
        content: null,
        writable: true,
        name,
        path: filePath,
        created,
        last_modified
      };
    }

    // TODO: Mimetype detection
    return {
      type: "file",
      mimetype: null,
      format: "text",
      content: null,
      writable: true,
      name,
      path: filePath,
      created,
      last_modified
    };
  }

  throw new Error(
    "Content listings can not be created from something that isn't a file or directory"
  );
}

function createContentPromise(
  options: DiskProviderOptions,
  filePath: string
): Promise<Content> {
  const fullPath = path.join(options.local.baseDirectory, filePath);
  const parsedFilePath = path.parse(filePath);
  return new Promise((resolve, reject) => {
    // perform a STAT call to create contents response
    fs.stat(fullPath, (err, stat) => {
      if (err) {
        // Could also resolve with an error, then filter it out
        // TODO: Decide on what to do in error case
        reject(err);
        return;
      }
      if (!(stat.isDirectory() || stat.isFile())) {
        // Mark non-directory and non-file as to be ignored
        reject(new Error(`${filePath} is not a directory or file`));
      }
      resolve(createContentResponse(parsedFilePath, stat));
    });
  });
}

function sanitizeFilePath(unsafeFilePath: string): string {
  return path.join(
    path
      .normalize(unsafeFilePath)
      // Remove leading `..`
      .replace(/^(\.\.[\/\\])+/, "")
      // Remove leading '/'
      .replace(/^([\/\\])+/, "")
  );
}

function get(
  options: DiskProviderOptions,
  unsafeFilePath: string
): Promise<Content> {
  const filePath = sanitizeFilePath(unsafeFilePath);

  // TODO: filePath should be normalized
  const contentP = createContentPromise(options, filePath);
  return contentP.then(content => {
    if (content.type === "directory") {
      return getDirectory(options, content);
    }
    if (content.type === "file") {
      return getFile(options, content);
    }
    if (content.type === "notebook") {
      return getNotebook(options, content);
    }
    throw new Error(`Unrecognized content type "${content.type}"`);
  });
}

function getDirectory(
  options: DiskProviderOptions,
  directory: DirectoryContent
): Promise<DirectoryContent> {
  return new Promise((resolve, reject) => {
    fs.readdir(
      path.join(options.local.baseDirectory, directory.path),
      (err, listing) => {
        if (err) {
          reject(err);
          return;
        }
        // Perform a stat call on each file, creating a promise for each
        // return value
        const contentPromises = listing.map(
          // map across each file listed from the directory
          fname =>
            // creating a promise for each filename
            createContentPromise(options, path.join(directory.path, fname))
          // TODO: Should we catch here
        );

        Promise.all(contentPromises)
          .then(contents => contents.filter(x => x !== null))
          .then(contents => {
            resolve(Object.assign({}, directory, { content: contents }));
          });
      }
    );
  });
}

function getFile(
  options: DiskProviderOptions,
  file: FileContent
): Promise<FileContent> {
  return new Promise((resolve, reject) => {
    // TODO: Should we support a streaming interface or nah
    fs.readFile(
      path.join(options.local.baseDirectory, file.path),
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(Object.assign({}, file, { content: data.toString() }));
      }
    );
  });
}

function getNotebook(
  options: DiskProviderOptions,
  notebook: NotebookContent
): Promise<NotebookContent> {
  return new Promise((resolve, reject) => {
    // TODO: Should we support a streaming interface or nah
    fs.readFile(
      path.join(options.local.baseDirectory, notebook.path),
      (err, data) => {
        if (err) {
          reject(err);
        }
        try {
          const notebookJSON: Object = JSON.parse(data.toString());
          resolve(Object.assign({}, notebook, { content: notebookJSON }));
          return;
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

module.exports = {
  get,
  sanitizeFilePath
};
