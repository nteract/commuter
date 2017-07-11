import React from "react";
import Link from "next/link";
require("isomorphic-fetch");

import { join as pathJoin } from "path";

import DirectoryListing from "../components/contents/directory-listing";
import Breadcrumb from "../components/bread-crumb";

import { Entry } from "../components/contents";

import Header from "../components/header";

import { Container } from "semantic-ui-react";

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

    const res = await fetch(url);

    const statusCode = res.status > 200 ? res.status : false;
    const json = await res.json();

    return {
      contents: json,
      statusCode,
      viewPath
    };
  }

  render() {
    if (this.props.statusCode) {
      return (
        <div>
          {`Nothing found for ${this.props.viewPath}`}
        </div>
      );
    }

    return (
      <div>
        <Header />
        <Container className="main">
          <div className="breadCrumb">
            <Breadcrumb path={this.props.viewPath} basepath={"/view"} />
          </div>
          <style jsx>{`
            div {
              padding-bottom: 20px;
            }
          `}</style>
          {/* Entry */}
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
        </Container>
      </div>
    );
  }
}

export default ViewPage;
