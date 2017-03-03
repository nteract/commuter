const assert = require("chai").assert;

describe("Test S3 service", function() {
  it("getObject returns notebook content", function() {
    const proxyquire = require("proxyquire");
    s3 = proxyquire("./../src/services/s3", {
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

  it("listObjectsV2 correctly", function() {
    const proxyquire = require("proxyquire");
    const s3 = proxyquire("./../src/services/s3", {
      "aws-sdk/clients/s3": function() {
        return {
          listObjectsV2: function(params, cb) {
            cb(null, {
              Contents: [
                {
                  Key: "dir/one/test.ipynb",
                  LastModified: "2016-05-25T17:26:26.000Z"
                }
              ],
              CommonPrefixes: [{ Prefix: "dir/one/" }]
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
          path: "/dir/one/test.ipynb",
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
          path: "/dir/one/",
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

  it("strips base path from listObjectsV2 listings", function() {
    const proxyquire = require("proxyquire");
    const s3 = proxyquire("./../src/services/s3", {
      "aws-sdk/clients/s3": function() {
        return {
          listObjectsV2: function(params, cb) {
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
          path: "/dir/one/test.ipynb",
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

  it("deleteObject deletes the object", function() {
    const proxyquire = require("proxyquire");
    s3 = proxyquire("./../src/services/s3", {
      "aws-sdk/clients/s3": function() {
        return {
          deleteObject: function(params, cb) {
            cb(null, { DeleteMarker: "true", VersionId: "123" });
          }
        };
      }
    });
    s3.deleteObject("dir/foo.ipynb", (err, data) => {
      assert.deepEqual(data, { DeleteMarker: "true", VersionId: "123" });
    });
  });

  it("uploadObject writes a file to s3 bucket", function() {
    const proxyquire = require("proxyquire");
    const expectedData = {
      ETag: '"dc328edabd19af595d98364de8c78c40"',
      VersionId: "lPHH5xnsJCLpKRzASI.oHuy0pEAXrAWf",
      Location: "https://foo.s3.amazonaws.com/dir/foo.ipynb",
      key: "dir/foo.ipynb",
      Key: "dir/foo.ipynb",
      Bucket: "foo"
    };
    payload = { msg: "test" };

    s3 = proxyquire("./../src/services/s3", {
      "aws-sdk/clients/s3": function() {
        return {
          upload: function(params, cb) {
            cb(null, expectedData);
          }
        };
      }
    });
    s3.uploadObject("dir/foo.ipynb", payload, (err, data) => {
      assert.deepEqual(data, expectedData);
    });
  });
});
