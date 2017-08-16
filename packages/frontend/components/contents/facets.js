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
    if (this.props.data !== prevProps.data) this.f.data = this.props.data;
  }

  render() {
    return (
      <facets-dive
        ref={f => {
          this.f = f;
        }}
        height={this.props.height}
      />
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

export class FacetsOverview extends React.Component {
  f: FacetsOverviewElement;

  componentDidMount() {
    this.f.protoInput = this.f.getStatsProto([this.props.data]);
  }

  componentDidUpdate(prevProps: FacetsOverviewProps) {
    if (this.props.data !== prevProps.data)
      this.f.protoInput = this.f.getStatsProto([this.props.data]);
  }

  render() {
    return (
      <facets-overview
        ref={f => {
          this.f = f;
        }}
        height="1000"
        style={{
          height: `${this.props.height}px`,
          overflow: "hidden",
          display: "block"
        }}
      />
    );
  }
}
