import * as React from "react";
import { renderToString } from "react-dom/server";
// @ts-ignore -- we need to write a definition file for react-safe
import Safe from "react-safe";

type Props = {
  entry: {
    content: string;
    path: string;
  };
};

export default class HTMLView extends React.Component<Props> {
  ref_iframe: React.RefObject<HTMLIFrameElement>;

  constructor(props: Props) {
    super(props);
    this.ref_iframe = React.createRef();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    window.addEventListener("message", this.resizeIframe, false);
  }

  resizeIframe = (message: MessageEvent) => {
    if (!this.ref_iframe.current) {
      return;
    }
    if (
      message.source == this.ref_iframe.current.contentWindow &&
      Array.isArray(message.data) &&
      message.data[0] == "iframeHeight"
    ) {
      this.ref_iframe.current.height = String(message.data[1] + 20);
    }
  };

  get iframe_content() {
    return (
      renderToString(
        <Safe.script>
          {`
          var reportedHeight = null;

          function getHeight() {
            var newHeight = Math.max(
              document.body.scrollHeight,
              document.body.offsetHeight,
              document.documentElement.clientHeight,
              document.documentElement.scrollHeight,
              document.documentElement.offsetHeight
            );
            if (reportedHeight !== newHeight) {
                reportedHeight = newHeight;
                parent.postMessage(['iframeHeight', newHeight], "*");
            }
          }

          window.setInterval(getHeight, 200);
      `}
        </Safe.script>
      ) + this.props.entry.content
    );
  }

  render() {
    return (
      <iframe
        title={`view of ${this.props.entry.path}`}
        sandbox="allow-scripts"
        style={{
          display: "block",
          margin: "0",
          padding: "0",
          width: "100%",
          border: "none"
        }}
        srcDoc={this.iframe_content}
        ref={this.ref_iframe}
      />
    );
  }
}
