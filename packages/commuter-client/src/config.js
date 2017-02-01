const {
  NODE_ENV = "test",
  REACT_APP_COMMUTER_PORT = 4000,
  REACT_APP_COMMUTER_HOST = "https://nteract-commuter.herokuapp.com"
} = process.env;

const port = NODE_ENV === "production" ? REACT_APP_COMMUTER_PORT : 3000;

const config = {
  nodeEnv: NODE_ENV,
  serverConfig: { endpoint: REACT_APP_COMMUTER_HOST }
};

console.log(process.env);
module.exports = config;
