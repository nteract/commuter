// @flow
const d3 = Object.assign({}, require("d3-dsv"));

import React from "react";

import Head from "next/head";

// $FlowFixMe: our flow config isn't picking up modules that package separate .js.flow files
import DataTransform from "@nteract/transform-dataresource";

import { FacetsDive, FacetsOverview } from "./facets";

import Tabs from "./tabs";

type DATA_RESOURCE = "Table";
type FACETS_OVERVIEW = "Overview";
type FACETS_DIVE = "Dive";

type CSVViewName = DATA_RESOURCE | FACETS_OVERVIEW | FACETS_DIVE;

const TAB_ITEMS: Array<CSVViewName> = ["Table", "Overview", "Dive"];

interface CSVViewProps {
  data: any
}

interface CSVViewState {
  currentView: CSVViewName,
  height: number
}

export default class CSVView extends React.Component {
  state: CSVViewState = {
    currentView: "Table",
    height: 800
  };

  componentDidMount() {
    const height = document.body ? document.body.offsetHeight - 200 : 600;
    this.setState({ height });
  }

  shouldComponentUpdate(nextProps: CSVViewProps, nextState: CSVViewState) {
    return nextState !== this.state;
  }

  render() {
    // TODO: Only parse on initial mount and when the props change (likely never going to happen)
    const data = d3.csvParse(this.props.entry.content);
    let view = null;
    switch (this.state.currentView) {
      case "Table":
        view = (
          <DataTransform
            data={{ data }}
            theme="light"
            height={this.state.height}
          />
        );
        break;
      case "Overview":
        view = (
          <FacetsOverview
            data={{ data, name: this.props.entry.name }}
            height={this.state.height}
          />
        );
        break;
      case "Dive":
        view = <FacetsDive data={data} height={this.state.height} />;
        break;
    }
    return (
      <Tabs
        items={TAB_ITEMS.map(item => ({
          name: item,
          active: this.state.currentView === item
        }))}
        onChange={this.handleChange}
      >
        <Head>
          <link rel="import" href="../../static/facets-jupyter.html" />
        </Head>
        {view}
      </Tabs>
    );
  }

  handleChange = (label: CSVViewName) => {
    this.setState({ currentView: label });
  };
}
