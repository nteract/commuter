// @flow

const bodybuilder = require("bodybuilder"),
  elasticsearch = require("elasticsearch");

export type ESDiscoveryBackendOptions = {
  host: string,
  log: string 
};

function createDiscoveryService(options: ESDiscoveryBackendOptions) {
  const client = new elasticsearch.Client(options);

  const list = (cb: Function, error: Function) =>
    client
      .search({
        index: "commuter",
        type: "notebooks",
        body: bodybuilder()
          .sort("last_modified", "desc")
          .size(1000)
          .build() 
      })
      .then(
        resp => {
          cb({ results: resp.hits.hits.map(hit => hit._source) });
        },
        err => {
          error(err.message);
        }
      );
  return {
    list
  };
}

export { createDiscoveryService };
