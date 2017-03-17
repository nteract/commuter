const config = require("./config"),
  bodybuilder = require("bodybuilder"),
  elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client(config.elasticSearch);

exports.list = (cb, error) => client
  .search({
    index: "commuter",
    type: "notebooks",
    body: bodybuilder().sort("last_modified", "desc").size(1000).build() //TODO: add pagination
  })
  .then(
    resp => {
      cb({ results: resp.hits.hits.map(hit => hit._source) });
    },
    err => {
      error(err.message);
    }
  );
