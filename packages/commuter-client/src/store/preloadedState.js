const INITIAL_STATE = {
  commuter: { entry: { type: "directory", content: []}, isFetching: false },
  notebook: { contents: null, isFetching: false },
  discovery: { discovered: [] }
};

export default INITIAL_STATE;
