// @flow
import React, { PropTypes as T } from "react";

// $FlowFixMe: our flow config isn't picking up modules that package separate .js.flow files
import NotebookPreview from "@nteract/notebook-preview";
// $FlowFixMe: our flow config isn't picking up modules that package separate .js.flow files
import MarkdownTransform from "@nteract/transforms/lib/markdown";

import DirectoryListing from "./directory-listing";

import { Container } from "semantic-ui-react";

import {
  standardTransforms,
  standardDisplayOrder,
  registerTransform
  // $FlowFixMe: our flow config isn't picking up modules that package separate .js.flow files
} from "@nteract/transforms";

import type { Content } from "./types";

// $FlowFixMe: our flow config isn't picking up modules that package separate .js.flow files
import DataResourceTransform from "@nteract/transform-dataresource";

const { transforms, displayOrder } = [
  DataResourceTransform
].reduce(registerTransform, {
  transforms: standardTransforms,
  displayOrder: standardDisplayOrder
});

import HTMLView from "./html";
import JSONView from "./json";
import CSVView from "./csv";

function suffix(name: string) {
  const suffixRegex = /(?:\.([^.]+))?$/;
  return (suffixRegex.exec(name)[1] || "").toLowerCase();
}

export function shouldFetch(name: string) {
  const suffix_ = suffix(name);
  const fetchables = new Set([
    // Noticeably absent are images since they're done by reference
    "json",
    "md",
    "markdown",
    "rmd",
    "csv",
    "ipynb"
  ]);

  return fetchables.has(suffix(name));
}

class File extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const name = this.props.entry.name;

    switch (suffix(name)) {
      case "html":
        return <HTMLView entry={this.props.entry} />;
      case "json":
        return <JSONView entry={this.props.entry} />;
      case "csv":
        return (
          <Container fluid>
            <CSVView entry={this.props.entry} />
          </Container>
        );
      case "md":
      case "markdown":
      case "rmd":
        return (
          <Container fluid>
            <div>
              <MarkdownTransform data={this.props.entry.content} />
            </div>
          </Container>
        );
      case "gif":
      case "jpeg":
      case "jpg":
      case "png":
        return (
          <Container fluid>
            <img
              src={`/files/${this.props.pathname}`}
              alt={this.props.pathname}
            />
          </Container>
        );
      default:
        return (
          <Container fluid>
            <a href={`/files/${this.props.pathname}`}>Download raw file</a>
          </Container>
        );
    }
  }
}

type EntryProps = {
  entry: Content,
  pathname: string,
  basepath: string
};

export const Entry = (props: EntryProps) => {
  if (props.entry.content === null) {
    return null;
  }

  switch (props.entry.type) {
    case "directory":
      // Dynamic type check on content being an Array
      if (Array.isArray(props.entry.content)) {
        return (
          <Container fluid textAlign="center">
            <DirectoryListing
              contents={props.entry.content}
              basepath={"/view"}
            />
          </Container>
        );
      }
      return null;
    case "file":
      // TODO: Case off various file types (by extension, mimetype)
      return <File entry={props.entry} pathname={props.pathname} />;
    case "notebook":
      return (
        <NotebookPreview
          notebook={props.entry.content}
          displayOrder={displayOrder}
          transforms={transforms}
        />
      );
    default:
      console.log("Unknown contents ");
      return (
        <pre>
          {JSON.stringify(props.entry.content)}
        </pre>
      );
  }
};
