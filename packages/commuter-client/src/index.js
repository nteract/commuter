import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory } from "react-router";

import App from "./App";
import Preview from "./Preview";

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/notebooks/*" component={Preview} />
    <Route path="/*" component={App} />
  </Router>,
  document.getElementById("root")
);
