import React from "react";

import JSONTransform from "@nteract/transforms/lib/json";
import HTML from "@nteract/transforms/lib/html";
import Text from "@nteract/transforms/lib/text";

import Editor from "@nteract/notebook-preview/lib/editor";

const HokeyTable = props => (
  <div>
    <style>
      {
        `
      table {
        border-collapse: collapse;
        border-spacing: 0;
        border-collapse: collapse;
        border-spacing: 0;
        empty-cells: show;
        border: 1px solid #cbcbcb;
        max-height: 200px;
        overflow-y: scroll;
      }

      td,
      th {
        padding: 0;
        border-left: 1px solid #cbcbcb;/*  inner column border */
      border-width: 0 0 0 1px;
      font-size: inherit;
      margin: 0;
      overflow: visible; /*to make ths where the title is really long work*/
      padding: 0.5em 1em; /* cell padding */
      }

      td:first-child,
      th:first-child {
          border-left-width: 0;
      }

      thead {
          background-color: #e0e0e0;
          color: #000;
          text-align: left;
          vertical-align: bottom;
      }
      `
      }
    </style>
    <table>
      <thead>
        <tr>
          {props.columnNames.map(column => (
            <th key={column.index}>{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, idx) => (
          <tr key={idx}>
            {row.map((item, colIdx) => <td key={colIdx}>{item}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UnsupportedResult = props => (
  <div>
    <h1>UNSUPPORTED ZEPPELIN RESULT</h1>
    <p>
      Post an issue to
      {" "}
      <a href="https://github.com/nteract/commuter/issues/new" target="_blank">
        commuter
      </a>
      {" "}
      to let us know about it
    </p>
    <JSONTransform data={props.result} />
  </div>
);

const Result = props => {
  if (!props.result) {
    return null;
  }
  if (!props.result.msg) {
    return <UnsupportedResult result={props.result} />;
  }

  switch (props.result.type) {
    case "HTML":
      return <HTML data={props.result.msg} />;
    case "TEXT":
      return <Text data={props.result.msg} />;
    case "TABLE":
      if (!props.result.columnNames || !props.result.rows) {
        return <UnsupportedResult result={props.result} />;
      }
      return (
        <HokeyTable
          columnNames={props.result.columnNames}
          rows={props.result.rows}
        />
      );
    default:
      return <UnsupportedResult result={props.result} />;
  }
};

const Paragraph = props => {
  return (
    <div>
      <Editor
        completion
        input={props.text}
        language="scala"
        theme="composition"
        cellFocused={false}
        onChange={() => {}}
        onFocusChange={() => {}}
        channels={{}}
        cursorBlinkRate={0}
        executionState={"not connected"}
        editorFocused={false}
        focusAbove={() => {}}
        focusBelow={() => {}}
        style={{
          paddingBottom: "10px",
          paddingTop: "10px"
        }}
      />
      <Result result={props.result} />
    </div>
  );
};

const ZeppelinView = props => {
  return (
    <div>
      <h1>{props.notebook.name}</h1>
      {props.notebook.paragraphs.map(p => <Paragraph key={p.id} {...p} />)}
    </div>
  );
};

export default ZeppelinView;
