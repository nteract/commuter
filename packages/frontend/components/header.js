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

type CommuterMenuProps = {
  active: "browse" | "view"
};

class Item extends React.Component {
  props: {
    isActive: boolean,
    children: any,
    href: string
  };

  static defaultProps = {
    isActive: false
  };

  render() {
    return (
      <li className={this.props.isActive ? "active" : ""}>
        <Link href={this.props.href}>
          {this.props.children}
        </Link>
      </li>
    );
  }
}

class CommuterMenu extends React.Component {
  props: {
    active: "view" | "discover"
  };

  static defaultProps = {
    active: "view"
  };

  handleItemClick = (e: SyntheticEvent, { name }: { name: string }) => {
    Router.push(name);
  };

  render() {
    const activeItem = "browse";

    return (
      <nav className="main-header">
        <ul>
          <Item href="/view">
            <img src="/static/logo.png" height="20" />
          </Item>
          <Item href="/view" isActive={this.props.active === "view"}>
            <a>Browse</a>
          </Item>
          <Item href="/discover" isActive={this.props.active === "discover"}>
            <a>Discover</a>
          </Item>
        </ul>
        <style jsx>{`
          nav {
          }
        `}</style>
      </nav>
    );
  }
}

export default CommuterMenu;
