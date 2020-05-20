import { Source } from "@nteract/presentational-components";

import { Media } from "@nteract/outputs";
import * as React from "react";
import styled from "styled-components";

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  border-collapse: collapse;
  border-spacing: 0;
  empty-cells: show;
  border: 1px solid #cbcbcb;
  max-height: 200px;
  overflow-y: scroll;
`;

const Thead = styled.thead`
  background-color: #e0e0e0;
  color: #000;
  text-align: left;
  vertical-align: bottom;
`;

const Code = styled.code`
  white-space: pre;
`;

const Div = styled.div`
  padding-bottom: 10px;
  padding-top: 10px;
`;

const tableCellStyles = `
  padding: 0;
  border-left: 1px solid #cbcbcb; /*  inner column border */
  border-width: 0 0 0 1px;
  font-size: inherit;
  margin: 0;
  overflow: visible; /*to make ths where the title is really long work*/
  padding: 0.5em 1em; /* cell padding */

  :first-child {
    border-left-width: 0;
  }
`;

const Td = styled.td`
  ${tableCellStyles}
`;
const Th = styled.th`
  ${tableCellStyles}
`;

const d3 = Object.assign({}, require("d3-dsv"));

const Text = (props: { data: string }) => (
  <React.Fragment>
    <Code>{props.data}</Code>
  </React.Fragment>
);

const HokeyTable = (props: any) => (
  <React.Fragment>
    <Table>
      <Thead>
        <tr>
          {props.columnNames.map((column: any) => (
            <Th key={column.index}>{column.name}</Th>
          ))}
        </tr>
      </Thead>
      <tbody>
        {props.rows.map((row: any, idx: number) => (
          <tr key={idx}>
            {row.map((item: any, colIdx: number) => (
              <Td key={colIdx}>{item}</Td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  </React.Fragment>
);

const DSVTable = (props: { data: Array<object> }) => {
  if (!Array.isArray(props.data) || props.data.length <= 0) {
    return null;
  }

  const columnNames = Object.keys(props.data[0]);
  const rows = props.data;

  return (
    <React.Fragment>
      <Table>
        <Thead>
          <tr>
            {columnNames.map((column, idx) => (
              <th key={idx}>{column}</th>
            ))}
          </tr>
        </Thead>
        <tbody>
          {rows.map((row: any, idx: number) => (
            <tr key={idx}>
              {columnNames.map((k, colIdx) => (
                <td key={colIdx}>{row[k]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

// Old style Zeppelin
const Message = (props: { type: "HTML" | "TEXT"; data: any }) => {
  switch (props.type) {
    case "HTML":
      return <Media.HTML data={props.data} />;
    case "TEXT":
      return <Text data={props.data} />;
    default:
      return null;
  }
};

const Result = (props: any) => {
  if (!props.result || props.result.msg === "") {
    return null;
  }

  switch (props.result.type) {
    case "HTML":
      return <Media.HTML data={props.result.msg} />;
    case "TEXT":
      return <Text data={props.result.msg} />;
    case "TABLE":
      if (!props.result.columnNames || !props.result.rows) {
        const data = d3.tsvParse(props.result.msg);
        // const columnNames = Object.keys(data[0]);

        return <DSVTable data={data} />;
      }
      return (
        <HokeyTable
          columnNames={props.result.columnNames}
          rows={props.result.rows}
        />
      );
    default:
      return null;
  }
};

const whichLanguage = (source: string) => {
  if (/^%md/.test(source)) {
    return "markdown";
  }

  if (/^%sql/.test(source)) {
    return "text/x-hive";
  }

  if (/^%pig/.test(source)) {
    return "pig";
  }

  if (
    /^%spark\.pyspark/.test(source) ||
    /^%pyspark/.test(source) ||
    /^%python/.test(source)
  ) {
    return "python";
  }

  if (/^%sh/.test(source)) {
    return "shell";
  }

  if (/^%spark/.test(source)) {
    return "text/x-scala";
  }

  if (/^%r/.test(source)) {
    return "r";
  }

  if (/^%html/.test(source)) {
    return "html";
  }

  return "text/x-scala";
};

type ParagraphProps = {
  text: string;
  result: any;
  type: any;
  results: { msg: Array<any> };
};

const Paragraph = (props: ParagraphProps) => {
  const lang = whichLanguage(props.text);

  let resultView = null;
  if (props.result) {
    resultView = <Result result={props.result} />;
  } else if (props.results && Array.isArray(props.results.msg)) {
    resultView = props.results.msg.map((item, idx) => (
      <Message {...item} key={idx} />
    ));
  }

  if (lang === "markdown") {
    return <Div>{resultView}</Div>;
  }

  return (
    <React.Fragment>
      <Source language={lang}>{props.text}</Source>
      <Div>{resultView}</Div>
    </React.Fragment>
  );
};

type ZeppelinViewProps = {
  notebook: {
    name: string;
    paragraphs: Array<ZParagraph>;
  };
};

type ZParagraph = any;

const ZeppelinView = (props: ZeppelinViewProps) => {
  return (
    <div style={{ paddingLeft: "10px" }}>
      <h1>{props.notebook.name}</h1>
      {props.notebook.paragraphs.map(p => (
        <Paragraph key={p.id} {...p} />
      ))}
    </div>
  );
};

export default ZeppelinView;
