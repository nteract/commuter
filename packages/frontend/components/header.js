import React from "react";
import Head from "next/head";
import Link from "next/link";
import NProgress from "nprogress";
import Router from "next/router";

import { Menu } from "semantic-ui-react";

Router.onRouteChangeStart = url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class CommuterMenu extends React.Component {
  handleItemClick = (e, { name }) => {
    Router.push(name, name, { shallow: true });
  };

  render() {
    const activeItem = "browse";

    return (
      <Menu fixed="top">
        <Menu.Item name="/view" onClick={this.handleItemClick}>
          <img src="/static/logo.png" width="300" className="logo" />
          commuter
        </Menu.Item>

        <Menu.Item name="/view" active={false} onClick={this.handleItemClick}>
          browse
        </Menu.Item>

        <Menu.Item
          name="/discover"
          active={false}
          onClick={this.handleItemClick}
        >
          discover
        </Menu.Item>
      </Menu>
    );
  }
}

export default CommuterMenu;
