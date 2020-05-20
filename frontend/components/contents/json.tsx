import * as React from "react";

import ZeppelinView from "./zeppelin";

import { Media } from "@nteract/outputs";

export default (props: { entry: { content: any; name: string } }) => {
  const content = JSON.parse(props.entry.content);
  try {
    // Zeppelin notebooks are called note.json, we'll go ahead and render them
    if (props.entry.name === "note.json") {
      return <ZeppelinView notebook={content} />;
    }

    return (
      <Media.Json
        data={content}
        metadata={{
          expanded: true
        }}
      />
    );
  } catch (e) {
    return (
      <React.Fragment>
        <h1>Failed to parse Zeppelin Notebook</h1>
        <pre>{e.toString()}</pre>
        <code>{props.entry.content}</code>
      </React.Fragment>
    );
  }
};
