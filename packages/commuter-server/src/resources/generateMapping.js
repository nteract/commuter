const path = require("path"),
  jsonfile = require("jsonfile"),
  nbformatv4Schema = require("nbschema").v4;

const writeFile = schema =>
  jsonfile.writeFileSync(
    path.resolve(__dirname, "commuter.es.mapping.json"),
    schema,
    { spaces: 2 }
  );

const add_type_info = nbSchema => {
  const { properties } = nbSchema.properties.metadata;
  //codemirror_mode key needs a type, and nbformat specifies
  //   "oneOf": [
  //   {
  //     "type": "string"
  //   },
  //   {
  //     "type": "object"
  //   }
  // ]
  properties.language_info.properties.codemirror_mode.type = "object";
  // ES doesn't support array types. Just use string type
  //https://www.elastic.co/guide/en/elasticsearch/reference/current/array.html
  properties.authors.type = "string";
  return Object.assign({}, properties);
};

const nteractSchema = () =>
  jsonfile.readFileSync(
    path.resolve(__dirname, "nteract.metadata.schema.json")
  );

const getCommuterSchema = () => ({
  mappings: {
    notebooks: {
      _timestamp: {
        enabled: true
      },
      properties: {
        name: {
          description: "Notebook name",
          type: "string"
        },
        path: {
          description: "Storage location of the notebook",
          type: "string"
        },
        created: {
          description: "Date created",
          type: "string"
        },
        last_modified: {
          description: "Date modified",
          type: "string"
        },
        mimetype: {
          description: "Content type",
          type: "string"
        },
        format: {
          description: "Format type",
          type: "string"
        },
        type: {
          description: "Notebook type",
          type: "string"
        },
        metadata: {
          properties: Object.assign(
            {},
            add_type_info(nbformatv4Schema),
            nteractSchema()
          )
        }
      }
    }
  }
});

//IIFE
{
  writeFile(getCommuterSchema());
}
