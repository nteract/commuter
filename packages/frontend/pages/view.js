import React from "react";
import Link from "next/link";
require("isomorphic-fetch");

import { join as pathJoin } from "path";

import DirectoryListing from "../components/contents/directory-listing";
import Breadcrumb from "../components/bread-crumb";

import { Entry } from "../components/contents";

// import Contents from "../original-client/contents";

class ViewPage extends React.Component {
  static async getInitialProps({ req, pathname, asPath, query }) {
    // Later, we'll use this to fill in the notebook
    // file data from the server side (or fallback to /api/contents)
    // For now, leaving "server": boolean to assist in debugging
    // during the refactor
    // The best choice will be to rely only on client side for now
    // I'm sure

    const viewPath = query.viewPath;

    let BASE_PATH;

    if (req) {
      const port = process.env.COMMUTER_PORT || 4000;
      BASE_PATH = `http://127.0.0.1:${port}/`;
    } else {
      BASE_PATH = "/";
    }

    const url = `${BASE_PATH}api/contents/${viewPath}`;

    const contents = await fetch(url).then(x => x.json());

    return {
      contents,
      viewPath
    };
  }

  render() {
    return (
      <div>
        {/* Nav */}
        {/* BreadCrumb */}
        <div className="breadCrumb">
          <Breadcrumb path={this.props.viewPath} basepath={"/view"} />
        </div>
        <style jsx>{`
          div {
            padding-bottom: 20px;
          }
        `}</style>
        <div>
          <Entry
            entry={this.props.contents}
            pathname={this.props.viewPath}
            basepath={"/view"}
          />
        </div>
        <style jsx>{`
          div {
            padding-left: 2rem;
          }
        `}</style>
      </div>
    );

    switch (this.props.contents.type) {
      case "directory":
        return (
          <DirectoryListing
            contents={this.props.contents.content}
            basepath="/view"
          />
        );
      case "notebook":
        return <NotebookPreview notebook={this.props.contents.content} />;
      default:
        return (
          <pre>
            {JSON.stringify(this.props.contents, null, 2)}
          </pre>
        );
    }
  }
}

export default ViewPage;
