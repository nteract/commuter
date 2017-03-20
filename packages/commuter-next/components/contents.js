// @flow
import React from "react";

import NoSSR from "react-no-ssr";
import DirectoryListing from "@nteract/commuter-directory-listing";
import NotebookPreview from "@nteract/notebook-preview";

export class File extends React.Component {
  ifr: HTMLElement;

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <iframe
          sandbox="allow-scripts"
          style={{ width: "100%", height: "100%", border: "none" }}
          src={"/files/test.html"}
          ref={(f: HTMLElement) => {
            this.ifr = f;
          }}
          height="100%"
          width="100%"
        />
      </div>
    );
  }
}

type NotebookEntry = {
  type: "notebook",
  content: Object
};

type DirectoryEntry = {
  type: "directory",
  content: Array<string>
};

type FileEntry = {
  type: "file",
  content: string
};

type EntryProps = {
  entry: NotebookEntry | DirectoryEntry | FileEntry,
  pathname: string,
  onClick: (s: string) => void
};

export const Entry = (props: EntryProps) => {
  switch (props.entry.type) {
    case "directory":
      return (
        <DirectoryListing
          path={props.pathname}
          contents={props.entry.content}
          onClick={props.onClick}
        />
      );
    case "file":
      // TODO: Case off various file types (by extension, mimetype)
      return <File entry={props.entry} pathname={props.pathname} />;
    case "notebook":
      if (navigator)
        return (
          <NoSSR> <NotebookPreview notebook={props.entry.content} /></NoSSR>
        );
    default:
      console.log("Unknown contents ");
      return <pre>{JSON.stringify(props.entry.content)}</pre>;
  }
};
