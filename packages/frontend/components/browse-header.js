// @flow
import React from "react";
import Head from "next/head";
import NProgress from "nprogress";
import Router from "next/router";

import NextLink from "next/link";
import { trim } from "lodash";

import { theme } from "../theme";

// Convert simple links to next style href + as
const Link = ({ to, children, basepath }) =>
  <NextLink
    href={{ pathname: "/view", query: { viewPath: to } }}
    as={basepath + "/" + to}
  >
    {children}
  </NextLink>;

class BrowseHeader extends React.Component {
  props: {
    path: string,
    basepath: string
  };

  static defaultProps = {
    active: "view"
  };

  handleItemClick = (e: SyntheticEvent, { name }: { name: string }) => {
    Router.push(name);
  };

  render() {
    const activeItem = "browse";
    const { path, basepath } = this.props;
    let paths = trim(path, "/").split("/");
    // Empty path to start off
    if (paths.length === 1 && paths[0] === "") {
      paths = [];
    }
    let breadCrumbs = [];

    return (
      <nav>
        <ul>
          <li>
            <Link to={``} basepath={basepath}>
              <a>
                <span>home</span>
              </a>
            </Link>
          </li>
          {paths.map((name, index) => {
            const filePath = paths.slice(0, index + 1).join("/");
            return (
              <li key={`${filePath}`}>
                <Link to={`${filePath}`} basepath={basepath}>
                  <a>
                    <span>
                      {name}
                    </span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
        <style jsx>{`
          nav {
            border: 1px solid ${theme.outline};
            padding-left: 1rem;
          }
          ul {
            display: flex;
            width: 100%;
            position: relative;

            margin: 0 0 0 0;
            padding: 0;

            list-style: none;
            background: #ffffff;
            font-family: "Source Sans Pro";
            font-size: 16px;
            color: ${theme.primary};
          }

          ul li {
            flex-direction: row;
            list-style-type: none;
            display: inline;
            text-align: center;
            display: flex;
            align-items: center;
          }

          ul li a {
            vertical-align: middle;
            display: table;
            padding: 1em;
            color: ${theme.primary};
          }

          ul li:last-child a {
            color: ${theme.active};
          }

          li + li:before {
            content: '›';
            color: ${theme.active};
          }
        `}</style>
      </nav>
    );
  }
}

export default BrowseHeader;
