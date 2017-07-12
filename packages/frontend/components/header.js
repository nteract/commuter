import React from "react";
import Head from "next/head";
import Link from "next/link";
import NProgress from "nprogress";
import Router from "next/router";

import { Menu, Image, Segment } from "semantic-ui-react";

Router.onRouteChangeStart = url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class CommuterMenu extends React.Component {
  handleItemClick = (e, { name }) => {
    Router.push(name);
  };

  render() {
    const activeItem = "browse";

    return (
      <Segment>
        <Menu fixed="top" borderless>
          <Menu.Item name="/view/" onClick={this.handleItemClick}>
            <Image src="/static/logo.png" size="mini" />
          </Menu.Item>

          <Menu.Item
            name="/view/"
            active={false}
            onClick={this.handleItemClick}
          >
            Browse
          </Menu.Item>

          <Menu.Item
            name="/discover"
            active={false}
            onClick={this.handleItemClick}
          >
            Discover
          </Menu.Item>
        </Menu>
      </Segment>
    );
  }
}

export default CommuterMenu;
