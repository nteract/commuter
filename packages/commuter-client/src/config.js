const { NODE_ENV = "test" } = process.env;
const port = NODE_ENV === "production" ? 4000 : 3000;

const config = {
  nodeEnv: NODE_ENV,
  serverConfig: { endpoint: `http://localhost:${port}` }
};

module.exports = config;
