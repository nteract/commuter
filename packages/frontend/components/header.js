// @flow
import React from "react";
import Head from "next/head";
import Link from "next/link";
import NProgress from "nprogress";
import Router from "next/router";

import { Menu, Image, Segment, Input } from "semantic-ui-react";

Router.onRouteChangeStart = url => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

type ActiveType = "view" | "discover";

class CommuterMenu extends React.Component {
  props: {
    active: ActiveType
  };

  static defaultProps = {
    active: "view"
  };

  handleItemClick = (e: SyntheticEvent, { name }: { name: string }) => {
    Router.push(name);
  };

  isActiveClass = (current: ActiveType): string =>
    this.props.active === current ? "active" : "";

  render() {
    const activeItem = "browse";

    return (
      <nav className="main-header">
        <ul className="items">
          <li className={this.isActiveClass("view")}>
            <Link href={"/view"}>
              <a>
                <img src="/static/logo.png" height="20" />
              </a>
            </Link>
          </li>
          <li className={this.isActiveClass("view")}>
            <Link href={"/view"}>
              <a>Browse</a>
            </Link>
          </li>
          <li className={this.isActiveClass("discover")}>
            <Link href={"/discover"}>
              <a>Discover</a>
            </Link>
          </li>
        </ul>
        <style jsx>{`
          ul {
            display: flex;
            width: 100%;
            position: relative;

            margin: 0 0 1.5rem 0;
            padding: 0;

            list-style: none;
          }

          ul li {
            flex-direction: row;
            list-style-type: none;
            padding-left: 1em;
            display: block;
            text-align: center;
          }

          ul li a {
            display: block;
            padding: 1rem 0;
          }
        `}</style>
      </nav>
    );
  }
}

export default CommuterMenu;
