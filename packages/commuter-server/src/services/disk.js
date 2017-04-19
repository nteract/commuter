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

const defaultDirectoryContent: DirectoryContent = Object.freeze({
  type: "directory",
  mimetype: null,
  writable: true,
  format: "json",

  content: null,
  name: "",
  path: "",
  created: new Date(),
  last_modified: new Date()
});

const defaultFileContent: FileContent = Object.freeze({
  type: "file",
  mimetype: null,
  writable: true,
  format: "text",

  content: null,
  name: "",
  path: "",
  created: new Date(),
  last_modified: new Date()
});

function createContentResponse(
  name: string,
  path: string,
  stat: fs.Stats
): Content {
  const contentBase = {
    name,
    path,
    writable: Boolean(fs.constants.W_OK & stat.mode),

    // $FlowFixMe: See https://github.com/facebook/flow/pull/3767
    created: stat.birthtime,

    last_modified: stat.mtime
  };

  if (stat.isDirectory()) {
    return {
      type: "directory",
      mimetype: null,
      format: "json",
      content: null,
      writable: true,
      name,
      path,
      // $FlowFixMe: See https://github.com/facebook/flow/pull/3767
      created: stat.birthtime,
      last_modified: stat.mtime
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
      path,
      // $FlowFixMe: See https://github.com/facebook/flow/pull/3767
      created: stat.birthtime,
      last_modified: stat.mtime
    };
  }

  throw new Error(
    "Content listings can not be created from something that isn't a file or directory"
  );
}

function getDirectory(dirPath): Promise<DirectoryContent> {
  // TODO: dirPath should be normalized
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, listing) => {
      if (err) {
        reject(err);
        return;
      }

      const parsedDirPath = path.parse(dirPath);

      const directory = Object.assign({}, defaultDirectoryContent, {
        name: parsedDirPath.name,
        path: dirPath,
        created: new Date(),
        last_modified: new Date()
      });

      // Perform a stat call on each file, creating a promise for each
      // return value
      const contentPromises = listing.map(
        // map across each file listed from the directory
        fname =>
          // creating a promise for each filename
          new Promise((resolve, reject) => {
            const filePath = path.join(dirPath, fname);
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
              resolve(createContentResponse(fname, filePath, stat));
            });
          })
      );

      Promise.all(contentPromises)
        .then(contents => contents.filter(x => x !== null))
        .then(contents => {
          directory.content = contents;
          resolve(directory);
        });
      return;
    });
  });
}

/*
function formContentsResponse(type, callback) {
  return function(err, data) {
    if (err) {
      callback(err);
      return;
    }

    callback(err, data);
  };
}

function get(commuterOptions, path, callback) {
  // TODO: Check if file or directory
  fs.readdir(path, formContentsResponse("directory", callback));
  fs.stat(path, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
    console.log();
  });
}
*/

/*get("", (err, data) => {
  console.log(err);
  console.log(data);
});*/

fs.stat(".", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

getDirectory(".");
