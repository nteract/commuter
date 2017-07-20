// @flow
// Note: imported Polymer component must be loaded before this

import React from "react";

type FacetDiveElement = {
  data: Array<Object>
};

type FacetsDiveProps = {
  data: Array<Object>
};

export class FacetsDive extends React.Component {
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

type FacetsOverviewElement = {
  protoInput: any,
  getStatsProto: Function
};

type FacetsOverviewProps = {
  data: any
};

// TODO: figure out how to convert csv -> protobuf in JS
export class FacetsOverview extends React.Component {
  f: FacetsOverviewElement;

  componentDidMount() {
    this.f.protoInput = this.f.getStatsProto(this.props.data);
  }

  componentDidUpdate(prevProps: FacetsOverviewProps) {
    if (this.props.data !== prevProps.data) {
      this.f.protoInput = this.f.getStatsProto(this.props.data);
    }
  }

  render() {
    return (
      <div>
        <facets-overview
          ref={f => {
            this.f = f;
          }}
          height="1000"
        />
      </div>
    );
  }
}
