import { Toaster, IToastProps } from "@blueprintjs/core";
import * as React from "react";
import styled from "styled-components";

import fetch from "isomorphic-unfetch";

const Span = styled.span`
  &.opsbutton {
    display: inline-block;
    line-height: 2em;
    padding: 0 8px;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.disabled > a {
    color: currentColor;
    display: inline-block; /* For IE11/ MS Edge bug */
    pointer-events: none;
    text-decoration: none;
  }
`;

type Props = {
  s3Bucket?: string;
  s3Key?: string;
  relpath?: string;
  versionId?: string;
};

type State = {
  cloning: boolean;
};

type CloneRequestSettings = {
  method: "POST";
  headers: {
    Accept: "application/json";
    "Content-Type": "application/json";
  };
  body: string;
};

export default class CloneButton extends React.Component<Props, State> {
  state = {
    cloning: false
  };

  toaster!: Toaster;

  refHandlers = {
    toaster: (ref: any) => (this.toaster = ref)
  };

  addToast = (toast: IToastProps) => {
    toast.timeout = 10000;
    if (this.toaster) {
      this.toaster.show(toast);
    }
  };

  onClick = () => {
    this.setState({ cloning: true });
  };

  componentWillUpdate = (_nextProps: Props, nextState: State) => {
    if (!this.state.cloning && nextState.cloning) {
      this.clone();
    }
  };

  clone = async () => {
    const { s3Bucket, s3Key, relpath, versionId } = this.props;
    const settings: CloneRequestSettings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: ""
    };
    if (s3Bucket && s3Key) {
      settings.body = JSON.stringify({
        s3Bucket,
        s3Key,
        versionId
      });
      fetch("/api/s3-clone", settings).then(async res => {
        const body = await res.json();
        window.location.href = body.url;
      });
      return;
    }

    try {
      settings.body = JSON.stringify({
        relpath
      });
      await fetch("/api/clone", settings).then(async res => {
        const body = await res.json();
        window.location.href = body.url;
      });
    } finally {
      this.setState({ cloning: false });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Span
          className={this.state.cloning ? "disabled opsbutton" : "opsbutton"}
        >
          <a className="ops" onClick={this.onClick}>
            Clone
          </a>
        </Span>
        <Toaster ref={this.refHandlers.toaster} />
      </React.Fragment>
    );
  }
}
