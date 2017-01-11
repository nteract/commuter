const assert = require("chai").assert;

describe("Test S3 service", function() {
  it("getObject returns notebook content", function() {
    const proxyquire = require("proxyquire");
    s3 = proxyquire("./../services/s3", {
      "aws-sdk/clients/s3": function() {
        return {
          getObject: function(params, cb) {
            cb(null, { Body: JSON.stringify("hello world") });
          }
        };
      }
    });
    s3.getObject("dir/foo.ipynb", (err, data) => {
      assert.equal(data, "hello world");
    });
  });

  it("listObjects correctly", function() {
    const proxyquire = require("proxyquire");
    const s3 = proxyquire("./../services/s3", {
      "aws-sdk/clients/s3": function() {
        return {
          listObjects: function(params, cb) {
            cb(null, {
              Contents: [
                {
                  Key: "dir/one/test.ipynb",
                  LastModified: "2016-05-25T17:26:26.000Z"
                }
              ],
              CommonPrefixes: [ { Prefix: "dir/one" } ]
            });
          }
        };
      },
      "../config": { s3: { Bucket: "test" } }
    });

    const expectedData = {
      name: "one",
      path: "dir/one",
      type: "directory",
      writable: true,
      created: null,
      last_modified: null,
      mimetype: null,
      content: [
        {
          name: "test.ipynb",
          path: "dir/one/test.ipynb",
          type: "notebook",
          writable: true,
          created: null,
          last_modified: "2016-05-25T17:26:26.000Z",
          mimetype: null,
          content: null,
          format: null
        },
        {
          name: "one",
          path: "dir/one",
          type: "directory",
          writable: true,
          created: null,
          last_modified: null,
          mimetype: null,
          content: null,
          format: null
        }
      ],
      format: "json"
    };
    s3.listObjects("dir/one", (err, data) => {
      assert.deepEqual(data, expectedData);
    });
  });

  it("strips base path from listObjects listings", function() {
    const proxyquire = require("proxyquire");
    const s3 = proxyquire("./../services/s3", {
      "aws-sdk/clients/s3": function() {
        return {
          listObjects: function(params, cb) {
            cb(null, {
              Contents: [
                {
                  Key: "s3BasePath/dir/one/test.ipynb",
                  LastModified: "2016-05-25T17:26:26.000Z"
                }
              ],
              CommonPrefixes: []
            });
          }
        };
      },
      "../config": { s3: { Bucket: "test" }, basePath: "s3BasePath" }
    });

    const expectedData = {
      name: "one",
      path: "dir/one",
      type: "directory",
      writable: true,
      created: null,
      last_modified: null,
      mimetype: null,
      content: [
        {
          name: "test.ipynb",
          path: "dir/one/test.ipynb",
          type: "notebook",
          writable: true,
          created: null,
          last_modified: "2016-05-25T17:26:26.000Z",
          mimetype: null,
          content: null,
          format: null
        }
      ],
      format: "json"
    };
    s3.listObjects("dir/one", (err, data) => {
      assert.deepEqual(data, expectedData);
    });
  });
});
