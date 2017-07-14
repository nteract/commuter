import React, { PropTypes as T } from "react";
import { Breadcrumb, Menu, Icon } from "semantic-ui-react";
import { trim } from "lodash";

import NextLink from "next/link";

import Router from "next/router";

// Convert simple links to next style href + as
const Link = ({ to, children, basepath }) =>
  <NextLink
    href={{ pathname: "/view", query: { viewPath: to } }}
    as={basepath + "/" + to}
  >
    {children}
  </NextLink>;

export class BreadCrumbMenu extends React.Component {
  handleItemClick = (e, { name }) => {
    Router.push(name);
  };

  render() {
    const { path, basepath } = this.props;
    let paths = trim(path, "/").split("/");
    // Empty path to start off
    if (paths.length === 1 && paths[0] === "") {
      paths = [];
    }
    let breadCrumbs = [];

    return (
      <div>
        <nav className="commuterBreadCrumb">
          <ul>
            <li>
              <Link to={``} basepath={basepath}>
                <a>
                  <span>
                    <Icon name="home" />
                  </span>
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
        </nav>
      </div>
    );
  }
}
