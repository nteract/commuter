import * as types from "../constants/ActionTypes";
import { serverConfig } from "./../config";

const jupyter = require("rx-jupyter");

export const receiveNotebook = rawJson => ({
  type: types.RECEIVE_NOTEBOOK,
  rawJson: rawJson,
  isFetching: false
});

export const requestNotebook = () => ({
  type: types.REQUEST_NOTEBOOK,
  isFetching: true
});

export const requestContents = () => ({
  type: types.REQUEST_CONTENTS,
  isFetching: true
});

export const receiveContents = contents => ({
  type: types.RECEIVE_CONTENTS,
  contents: contents,
  isFetching: false
});

export const fetchNotebook = path => {
  return dispatch => {
    dispatch(requestNotebook());
    return jupyter.contents
      .get(serverConfig, path)
      .subscribe(res => dispatch(receiveNotebook(res.response)));
  };
};

export const fetchContents = path => {
  return dispatch => {
    dispatch(requestContents());
    return jupyter.contents
      .get(serverConfig, path)
      .subscribe(res => dispatch(receiveContents(res.response.content)));
  };
};
