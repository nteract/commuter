import { combineReducers } from "redux";
import * as types from "../constants/ActionTypes";

const notebook = (state = {}, action) => {
  switch (action.type) {
    case types.REQUEST_NOTEBOOK:
      return Object.assign({}, state, { isFetching: action.isFetching });
    case types.RECEIVE_NOTEBOOK:
      return Object.assign({}, state, {
        rawJson: action.rawJson,
        isFetching: action.isFetching
      });
    default:
      return state;
  }
};

const commuter = (state = {}, action) => {
  switch (action.type) {
    case types.REQUEST_CONTENTS:
      return Object.assign({}, state, { isFetching: action.isFetching });
    case types.RECEIVE_CONTENTS:
      return Object.assign({}, state, {
        contents: action.contents,
        isFetching: action.isFetching
      });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  notebook,
  commuter
});

export default rootReducer;
