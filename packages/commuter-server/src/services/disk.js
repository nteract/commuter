// @flow
/**
 * Goal:
 *
 * - Create a local storage provider for commuter
 * - Unify interface between S3 and local storage
 *
 */

const fs = require("fs");

type TimeStamp = string; // TODO: Figure out what time it is

type Contents = {
  name: string,
  path: string,
  type: "directory" | "notebook" | "file",
  writable: boolean,
  mimetype: string | null,
  created: TimeStamp,
  last_modified: TimeStamp,
  format: "json" | null
};

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
