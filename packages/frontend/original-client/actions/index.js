import * as types from "../constants/ActionTypes";
import { serverConfig } from "./../config";

const jupyter = require("rx-jupyter");

export const requestContents = () => ({
  type: types.REQUEST_CONTENTS,
  isFetching: true
});

export const receiveContents = entry => ({
  type: types.RECEIVE_CONTENTS,
  entry: entry,
  isFetching: false
});

export const receiveDiscoveryResults = results => ({
  type: types.RECEIVE_DISCOVERY_RESULTS,
  results: results
});

// TODO: Switch to Rx ajax
export const discoverNotebooks = () => {
  return dispatch => {
    fetch("/api/v1/discovery")
      .then(res => res.json())
      .then(res => dispatch(receiveDiscoveryResults(res.results)));
  };
};

// TODO: Convert these to epics with explicit error handling and
//       event handling cleanup
export const fetchContents = path => {
  return dispatch => {
    dispatch(requestContents());
    return jupyter.contents
      .get(serverConfig, path)
      .subscribe(res => dispatch(receiveContents(res.response)));
  };
};
