// @flow
const d3 = Object.assign({}, require("d3-dsv"));

import React from "react";

import Head from "next/head";

// $FlowFixMe: our flow config isn't picking up modules that package separate .js.flow files
import DataTransform from "@nteract/transform-dataresource";

import { FacetsDive, FacetsOverview } from "./facets";

import Tabs from "./tabs";

const DATA_RESOURCE = "Data Resource";
const FACETS_OVERVIEW = "Facets Overview";
const FACETS_DIVE = "Facets Dive";
const TAB_ITEMS = [DATA_RESOURCE, FACETS_OVERVIEW, FACETS_DIVE];

type CSVViewName = "Data Resource" | "Facets Overview" | "Facets Dive";

interface CSVViewProps {
  data: any
}

interface CSVViewState {
  currentView: CSVViewName
}

export default class CSVView extends React.Component {
  state: CSVViewState = {
    currentView: DATA_RESOURCE
  };

  shouldComponentUpdate(nextProps: CSVViewProps, nextState: CSVViewState) {
    return nextState.currentView !== this.state.currentView;
  }

  render() {
    const data = d3.csvParse(this.props.entry.content);
    let view = <DataTransform data={{ data }} theme="light" />;
    switch (this.state.currentView) {
      case FACETS_OVERVIEW:
        view = <FacetsOverview data={{ data, name: this.props.entry.name }} />;
        break;
      case FACETS_DIVE:
        view = <FacetsDive data={data} />;
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
