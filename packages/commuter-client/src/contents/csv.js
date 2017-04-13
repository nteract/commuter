const d3 = Object.assign({}, require("d3-dsv"));

import React from "react";

export default class CSVView extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <pre>No CSV rendering yet!</pre>;
  }
}
