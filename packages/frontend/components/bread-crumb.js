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
        <nav>
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
        <style jsx>{`
          nav {
            font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
              sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
              "Segoe UI Symbol";
          }

          nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            background-color: white;
          }
          nav li {
            display: inline-block;
            margin: 0 5px;
            transition: all 0.3s;
          }
          nav a {
            display: block;
            color: gray;
            transition: all 0.3s;
          }
          nav a:hover {
            color: gray;
          }
          nav span {
            display: block;
          }

          @media all and (min-width: 690px) {
            nav li {
              margin: 0;
              transform: skew(-10deg);
            }

            nav li:first-child {
              margin-left: 30px;
            }

            nav a {
              padding: 10px 20px;
              color: #111;
              background-color: #e7e7e7;
              margin-left: 5px;
            }
            nav a:hover {
              color: #111;
              background-color: #fff;
            }

            a span {
              transform: skew(10deg);
            }
          }
        `}</style>
      </div>
    );
  }
}
