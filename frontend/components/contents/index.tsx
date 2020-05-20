import * as React from "react";

//@ts-ignore
import Markdown from "@nteract/markdown";
import { Source } from "@nteract/presentational-components";
import DirectoryListing from "./directory-listing";
import CSVView from "./csv";
import HTMLView from "./html";
import JSONView from "./json";
import TEXTView from "./text";
import Notebook from "./notebook";

import { Content } from "../../../backend/src/types";

import { fromJS } from "@nteract/commutable";

const suffixRegex = /(?:\.([^.]+))?$/;

class File extends React.Component<any> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const name = this.props.entry.name;
    const presuffix = suffixRegex.exec(name);

    if (!presuffix) {
      return null;
    }

    const suffix = (presuffix[1] || "").toLowerCase();

    const fileBase = this.props.basepath.replace(/view(\/?)/, "files/");
    switch (suffix) {
      case "html":
        return <HTMLView entry={this.props.entry} />;
      case "json":
        return <JSONView entry={this.props.entry} />;
      case "csv":
        return <CSVView entry={this.props.entry} />;
      case "md":
      case "markdown":
      case "rmd":
        return <Markdown source={this.props.entry.content} />;
      case "js":
        return (
          <Source language="javascript">{this.props.entry.content}</Source>
        );
      case "py":
      case "pyx":
        return <Source language="python">{this.props.entry.content}</Source>;
      case "gif":
      case "jpeg":
      case "jpg":
      case "png":
        return (
          <img
            src={`${fileBase}${this.props.pathname}`}
            alt={this.props.pathname}
          />
        );
      default:
        if (this.props.entry.format === "text") {
          return <TEXTView entry={this.props.entry} />;
        }
        return (
          <a href={`${fileBase}${this.props.pathname}`}>Download raw file</a>
        );
    }
  }
}

type EntryProps = {
  entry: Content;
  pathname: string;
  basepath: string;
  codeHidden?: boolean | undefined;
};

export class Entry extends React.Component<EntryProps> {
  get documentUri() {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
  }

  get authorEmails() {
    let username = "";
    for (const component of this.props.pathname.split("/")) {
      if (component !== "") {
        username = component;
        break;
      }
    }
    return [];
  }

  render() {
    if (this.props.entry.content === null) {
      return null;
    }

    switch (this.props.entry.type) {
      case "directory":
        // Dynamic type check on content being an Array
        if (Array.isArray(this.props.entry.content)) {
          return (
            <DirectoryListing
              contents={this.props.entry.content}
              basepath={this.props.basepath}
            />
          );
        }
        return null;
      case "file":
        // TODO: Case off various file types (by extension, mimetype)
        return (
          <File
            basepath={this.props.basepath}
            entry={this.props.entry}
            pathname={this.props.pathname}
          />
        );
      case "notebook":
        const { codeHidden, entry, pathname } = this.props;
        const notebook = fromJS(entry.content as any);

        return (
          <Notebook codeHidden={codeHidden} notebook={notebook} />
        );
      default:
        return (
          <pre>
            {JSON.stringify(
              //@ts-ignore
              this.props.entry.content
            )}
          </pre>
        );
    }
  }
}
