import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../reducers";

const configureStore = preloadedState =>
  createStore(rootReducer, preloadedState, applyMiddleware(thunkMiddleware));

export default configureStore;
