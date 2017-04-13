import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import INITIAL_STATE from "./store/preloadedState";
import configureStore from "./store/configureStore";

import App from "./App";
import Discovery from "./Discovery";
import Contents from "./contents";

const store = configureStore(INITIAL_STATE);

ReactDOM.render(
  <Provider store={store}>
    <Router basename="/">
      <div>
        <Route exact path="/" render={() => <Redirect to="/view/" />} />
        <App>
          <Switch>
            <Route path="/discover" component={Discovery} />
            <Route path="/view/*" component={Contents} />
          </Switch>
        </App>
      </div>
    </Router>
  </Provider>,
  document.getElementById("root")
);
