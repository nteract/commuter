import { fromJS } from "@nteract/commutable";
import * as React from "react";
import styled from "styled-components";
import { trim } from "lodash";
import * as Immutable from "immutable";
import fetch from "isomorphic-unfetch";

import Header from "../components/header";
import BrowseHeader from "../components/browse-header";

import { Entry } from "../components/contents";
import { NextPageContext } from "next";

type ViewPageProps = {
  contents: any;
  statusCode: any;
  viewPath: any;
};

type ViewPageState = {
  hideCode: boolean | undefined;
  kernel: string | undefined;
};

const EntryDiv = styled.div`
  margin-top: 1em;
  padding-left: 0.5em;
  padding-right: 0.5em;
`;

const HIDE_INPUT_METADATA_KEY = "hide_input";
const INPUT_HIDDEN_JUPYTER_PATH = ["jupyter", "source_hidden"];

export function isInputHidden(metadata: Immutable.Map<string, any>): boolean {
  // Check jupyter.source_hidden then check hide_input, falling back to false
  return metadata.getIn(
    INPUT_HIDDEN_JUPYTER_PATH,
    metadata.get(HIDE_INPUT_METADATA_KEY, false)
  );
}

// TODO: Properly type function.
export function getKernelName(contents: any) {
  const notebook = fromJS(contents.content as any);
  return notebook.metadata.getIn(["kernelspec", "display_name"], "None");
}

// TODO: Properly type function.
export function checkIfCodeIsHidden(contents: any) {
  const notebook = fromJS(contents.content as any);
  return isInputHidden(notebook.metadata);
}

class ViewPage extends React.Component<ViewPageProps, ViewPageState> {
  state = {
    hideCode: false,
    kernel: undefined,
  };

  static async getInitialProps(context: NextPageContext) {
    const req = context.req;
    const query = context.query;
    let viewPath = query.viewPath || "";
    if (typeof viewPath !== "string") {
      throw new Error("viewPath should be a string");
    }
    viewPath = trim(viewPath, "/");

    let BASE_PATH;

    if (req) {
      // Server side, communicate with our local API
      const port = process.env.COMMUTER_PORT || 4000;
      BASE_PATH = `http://127.0.0.1:${port}/`;
    } else {
      BASE_PATH = "/";
    }

    const url = `${BASE_PATH}api/contents/${viewPath}`;

    const response = await fetch(url);
    const contents = await response.json();

    return {
      contents,
      statusCode: response.status,
      viewPath,
    };
  }

  handleToggleHide = () => this.setState({ hideCode: !this.state.hideCode });

  componentDidMount = () => {
    // Need to determine whether code cells are hidden within the notebook
    // in order to update the state and to grab the notebook kernel name.
    if (this.props.contents.type === "notebook") {
      if (checkIfCodeIsHidden(this.props.contents)) {
        this.setState({ hideCode: true });
      }

      this.setState({ kernel: getKernelName(this.props.contents) });
    }
  };

  render() {
    const { contents, statusCode, viewPath } = this.props;

    if (statusCode !== 200) {
      return `Nothing found for ${viewPath}`;
    }

    return (
      <React.Fragment>
        <Header active="view" kernel={this.state.kernel} />
        <BrowseHeader
          basepath={"/view"}
          path={viewPath}
          type={contents.type}
          hideCode={this.state.hideCode}
          onToggleHide={this.handleToggleHide}
        />
        {/* Entry */}
        <EntryDiv className="entry">
          <Entry
            entry={contents}
            pathname={viewPath}
            basepath={"/view"}
            codeHidden={this.state.hideCode}
          />
        </EntryDiv>
      </React.Fragment>
    );
  }
}

export default ViewPage;
