// @flow
// Note: imported Polymer component must be loaded before this

import React from "react";

type FacetDiveElement = {
  data: Array<Object>
};

type FacetsDiveProps = {
  data: Array<Object>
};

export default class FacetsDive extends React.Component {
  f: FacetDiveElement;

  componentDidMount() {
    this.f.data = this.props.data;
  }

  componentDidUpdate(prevProps: FacetsDiveProps) {
    if (this.props.data !== prevProps.data) {
      this.f.data = this.props.data;
    }
  }

  render() {
    return (
      <div>
        <facets-dive
          ref={f => {
            this.f = f;
          }}
          height="1000"
        />
      </div>
    );
  }
}
