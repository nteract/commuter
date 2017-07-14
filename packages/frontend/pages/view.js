import React from "react";
import Link from "next/link";
require("isomorphic-fetch");

import { join as pathJoin } from "path";

import DirectoryListing from "../components/contents/directory-listing";
import { BreadCrumbMenu } from "../components/bread-crumb";

import { Entry } from "../components/contents";

import Header from "../components/header";

import { Container, Menu, Segment } from "semantic-ui-react";

import Body from "../components/body";

// import Contents from "../original-client/contents";

class ViewPage extends React.Component {
  static async getInitialProps({ req, pathname, asPath, query }) {
    // Later, we'll use this to fill in the notebook
    // file data from the server side (or fallback to /api/contents)
    // For now, leaving "server": boolean to assist in debugging
    // during the refactor
    // The best choice will be to rely only on client side for now
    // I'm sure

    const viewPath = query.viewPath || "/";

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
        <BreadCrumbMenu basepath={"/view"} path={this.props.viewPath} />
        {/*
              <Menu.Menu position="right">
                <Menu.Item>
                  <Input icon="search" placeholder="Search..." />
                </Menu.Item>
                <Menu.Item
                  name="logout"
                  active={activeItem === "logout"}
                  onClick={this.handleItemClick}
                />
              </Menu.Menu>
            */}
        <Body>
          {/* Entry */}
          <div className="entry">
            <Entry
              entry={this.props.contents}
              pathname={this.props.viewPath}
              basepath={"/view"}
            />
          </div>
        </Body>
        <style jsx>{`
          .entry {
            padding-left: 2rem;
          }
        `}</style>
      </div>
    );
  }
}

export default ViewPage;
