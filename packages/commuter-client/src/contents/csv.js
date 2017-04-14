const d3 = Object.assign({}, require("d3-dsv"));

import React from "react";
import DataTransform from "@nteract/transform-dataresource";

import "react-virtualized/styles.css";

import { infer } from "jsontableschema";

const SAMPLE_SIZE = 10;

function getSampleRows(data, sampleSize) {
  return Array.from({ length: Math.min(sampleSize, data.length) }, () => {
    const index = Math.floor(Math.random() * data.length);
    return data[index];
  });
}

function inferSchema(data) {
  const sampleRows = getSampleRows(data, SAMPLE_SIZE);
  const headers = Array.from(
    sampleRows.reduce(
      (result, row) => new Set([...result, ...Object.keys(row)]),
      new Set()
    )
  );
  const values = sampleRows.map(row => Object.values(row));
  return infer(headers, values);
}

export default class CSVView extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const data = d3.csvParse(this.props.entry.content);
    const schema = inferSchema(data);
    return (
      <div>
        <DataTransform data={{ data, schema }} theme="light" />
      </div>
    );
  }
}
