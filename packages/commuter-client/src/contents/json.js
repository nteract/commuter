import React from "react";

import { Container } from "semantic-ui-react";

import { css } from "aphrodite";

import { styles } from "../stylesheets/commuter";

import ZeppelinView from "./zeppelin";

import JSONTransform from "@nteract/transforms/lib/json";

import Immutable from "immutable";

export default props => {
  const content = JSON.parse(props.entry.content);
  try {
    // Zeppelin notebooks are called note.json, we'll go ahead and render them
    if (props.entry.name === "note.json") {
      return <ZeppelinView notebook={content} />;
    }

    return (
      <Container fluid className={css(styles.innerContainer)}>
        <JSONTransform
          data={content}
          metadata={Immutable.Map({
            expanded: true
          })}
        />
      </Container>
    );
  } catch (e) {
    return (
      <div>
        <h1>Failed to parse Zeppelin Notebook</h1>
        <pre>{e.toString()}</pre>
        <code>{this.props.entry.content}</code>
      </div>
    );
  }
};
