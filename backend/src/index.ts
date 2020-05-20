import { createServer } from "./server";

import * as http from "http";

const Log = require("log"),
  log = new Log("info");

createServer()
  .then((server: http.Server) => {
    const address = server.address();

    if (typeof address === "string") {
      log.info("Commuter server listening at ", address);
    } else {
      log.info("Commuter server listening on port  ", address!.port);
    }
  })
  .catch((e: Error) => {
    console.error(e);
    console.error(e.stack);
    process.exit(-10);
  });
