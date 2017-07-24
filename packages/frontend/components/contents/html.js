// @flow

import React from "react";

export default class HTMLView extends React.Component {
  ifr: HTMLIFrameElement;

  componentDidMount() {
    const el = this.ifr;
    this.ifr.onload = () => {
      const height =
        (el.contentDocument &&
          el.contentDocument.body &&
          el.contentDocument.body.scrollHeight) ||
        "400";
      el.style.height = `${height}px`;
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={{}}>
        <iframe
          sandbox="allow-scripts"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            margin: "0",
            padding: "0"
          }}
          srcDoc={this.props.entry.content}
          ref={f => {
            this.ifr = f;
          }}
        />
      </div>
    );
  }
}
