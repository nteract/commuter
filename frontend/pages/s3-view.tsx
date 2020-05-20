import * as React from "react";
import styled from "styled-components";
import { trim } from "lodash";
import fetch from "isomorphic-unfetch";

import { NextPageContext } from "next";
import { ObjectVersionList } from "aws-sdk/clients/s3";

import { checkIfCodeIsHidden, getKernelName } from "./view";
import Header from "../components/header";
import BrowseHeader from "../components/browse-header";
import { Entry } from "../components/contents";

type ViewPageProps = {
  contents: any;
  statusCode: any;
  viewPath: any;
  versionId: string;
  versions: ObjectVersionList;
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

class S3ViewPage extends React.Component<ViewPageProps, ViewPageState> {
  state = {
    hideCode: false,
    kernel: undefined,
  };

  static async getInitialProps(context: NextPageContext) {
    const req = context.req;
    const query = context.query;
    const versionId = query.VersionId;
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

    const url = `${BASE_PATH}api/s3-contents/${viewPath}${
      versionId ? "?VersionId=" + versionId : ""
    }`;

    const response = await fetch(url);

    const contents = await response.json();

    return {
      contents,
      statusCode: response.status,
      viewPath,
      versionId,
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
    const { contents, versionId, viewPath } = this.props;
    const [s3Bucket, ...s3KeyArray] = this.props.viewPath.split("/");
    const s3Key = s3KeyArray.join("/");

    if (this.props.statusCode !== 200) {
      return `Nothing found for ${this.props.viewPath}`;
    }

    return (
      <React.Fragment>
        <Header active={"s3-view"} kernel={this.state.kernel} />
        <BrowseHeader
          basepath={"/s3-view"}
          path={viewPath}
          type={contents.type}
          hideCode={this.state.hideCode}
          hideHome={true}
          s3Bucket={s3Bucket}
          s3Key={s3Key}
          versionId={versionId}
          onToggleHide={this.handleToggleHide}
        />
        {/* Entry */}
        <EntryDiv className="entry">
          <Entry
            entry={contents}
            pathname={viewPath}
            basepath={"/s3-view"}
            codeHidden={this.state.hideCode}
          />
        </EntryDiv>
      </React.Fragment>
    );
  }
}

export default S3ViewPage;
