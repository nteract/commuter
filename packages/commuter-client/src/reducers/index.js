import { combineReducers } from "redux";
import * as types from "../constants/ActionTypes";

const commuter = (state = {}, action) => {
  switch (action.type) {
    case types.REQUEST_CONTENTS:
      return Object.assign({}, state, { isFetching: action.isFetching });
    case types.RECEIVE_CONTENTS:
    // filter out hidden files
    const content = action.entry.type === 'directory' ?
    action.entry.content.filter((file) => {
      return !file.name.startsWith('.')
    }) : action.entry.content;
    const entry = Object.assign({}, action.entry, { content });
      return Object.assign({}, state, {
        entry,
        isFetching: action.isFetching
      });
    default:
      return state;
  }
};

const discovery = (state = { discovered: [] }, action) => {
  switch (action.type) {
    case types.RECEIVE_DISCOVERY_RESULTS:
      return Object.assign({}, state, { discovered: action.results });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  commuter,
  discovery
});

export default rootReducer;
