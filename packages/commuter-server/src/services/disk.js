// @flow
/**
 * Goal:
 *
 * - Create a local storage provider for commuter
 * - Unify interface between S3 and local storage
 *
 */

const fs = require("fs");
const path = require("path");

type TimeStamp = Date;

type DirectoryContent = {
  type: "directory",
  mimetype: null,
  content: null | Array<Content>, // Technically content-free content ;)

  name: string,
  path: string,

  created: TimeStamp,
  last_modified: TimeStamp,
  writable: boolean,
  format: "json"
};

type NotebookContent = {
  type: "notebook",
  mimetype: null,
  content: null | Object, // Could allow for some notebookisms here

  name: string,
  path: string,

  created: TimeStamp,
  last_modified: TimeStamp,
  writable: boolean,
  format: "json"
};

type FileContent = {
  type: "file",
  mimetype: null | string,
  content: null | string,

  name: string,
  path: string,

  created: TimeStamp,
  last_modified: TimeStamp,
  writable: boolean,
  format: null | "text" | "base64"
};

type Content = DirectoryContent | FileContent | NotebookContent;

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
  const name = parsedFilePath.name;
  const filePath = path.join(parsedFilePath.dir, parsedFilePath.base);
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
      name,
      path: filePath,
      created,
      last_modified
    };
  } else if (stat.isFile()) {
    // TODO: Handle notebook differently
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

function createContentPromise(filePath): Promise<Content> {
  const parsedFilePath = path.parse(filePath);
  return new Promise((resolve, reject) => {
    // perform a STAT call to create contents response
    fs.stat(filePath, (err, stat) => {
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

function get(filePath): Promise<Content> {
  // TODO: filePath should be normalized
  const contentP = createContentPromise(filePath);
  return contentP.then(content => {
    if (content.type === "directory") {
      return getDirectory(content);
    }
    if (content.type === "file") {
      return getFile(content);
    }
    throw new Error("WHOA THERE BUCKAROO");
  });
}

function getDirectory(directory: DirectoryContent): Promise<DirectoryContent> {
  return new Promise((resolve, reject) => {
    fs.readdir(directory.path, (err, listing) => {
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
          createContentPromise(path.join(directory.path, fname))
      );

      Promise.all(contentPromises)
        .then(contents => contents.filter(x => x !== null))
        .then(contents => {
          resolve(Object.assign({}, directory, { content: contents }));
        });
    });
  });
}

function getFile(file: FileContent): Promise<FileContent> {
  return new Promise((resolve, reject) => {
    // TODO: Should we support a streaming interface or nah
    fs.readFile(file.path, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(Object.assign({}, file, { content: data.toString() }));
    });
  });
}

get("./").then(ls => console.log("\n**LISTING**\n", ls));

get("./package.json").then(fi => console.log("\n**FILE**\n", fi));
