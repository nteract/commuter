import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { Router, Route, browserHistory, IndexRoute } from "react-router";

import INITIAL_STATE from "./store/preloadedState";
import configureStore from "./store/configureStore";

import App from "./App";
import Notebook from "./Notebook";
import Commuter from "./Commuter";

const store = configureStore(INITIAL_STATE);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Commuter} />
        <Route path="*.ipynb" component={Notebook} />
        <Route path="*" component={Commuter} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById("root")
);
