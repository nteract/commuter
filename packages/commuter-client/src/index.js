import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { createHistory, useBasename } from 'history'
import { Router, Route, IndexRoute } from "react-router";

import INITIAL_STATE from "./store/preloadedState";
import configureStore from "./store/configureStore";

import App from "./App";
import Notebook from "./Notebook";
import Commuter from "./Commuter";
import Discovery from "./Discovery";

const history = useBasename(createHistory)({
  basename: '/view'
})

const store = configureStore(INITIAL_STATE);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Commuter} />
        <Route path="/discover" component={Discovery} />
        <Route path="*.ipynb" component={Notebook} />
        <Route path="*" component={Commuter} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById("root")
);
