import * as React from "react";

import Link from "next/link";
import Router from "next/router";
import styled from "styled-components";

// Local modules
import { theme } from "../theme";

import NProgress from "nprogress";

if (typeof window !== "undefined") {
  NProgress.configure({ showSpinner: false });

  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });

  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });

  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
}

type ActiveType = "view" | "s3-view";

const Nav = styled.nav`
  background: ${theme.background};
  border: 1px solid ${theme.outline};
  font-family: "Source Sans Pro";
  font-size: 16px;
  color: ${theme.primary};
  padding-left: 1.5em;
  display: flex;
  flex-direction: row;

  a:hover {
    text-decoration: underline;
  }
`;

const AppIcon = styled.img`
  height: 2.5rem;
  vertical-align: middle;
  padding-right: 1em;
`;

const Items = styled.ul`
  display: flex;
  flex: 1 1 auto;
  position: relative;

  margin: 0;
  padding: 0;
  text-align: center;

  list-style: none;
`;

const MetadataItems = styled.ul`
  display: flex;
  flex: 0 1 auto;
  margin: 0 40px 0 0;
  padding: 0;
`;

const Item = styled.li`
  flex-direction: row;
  list-style-type: none;
  display: inline;
  text-align: center;
  display: flex;
  align-items: center;

  a {
    vertical-align: middle;
    display: table;
    padding: 1em;
    color: ${theme.primary};
    text-decoration: none;
  }

  &.active a {
    color: ${theme.active};
    font-weight: 500;
  }
`;

const Kernel = styled(Item)`
  color: #000000;
`;

type Props = {
  active: ActiveType;
  kernel?: String;
};

class CommuterMenu extends React.Component<Props> {
  static defaultProps = {
    active: "view",
  };

  handleItemClick = (
    _e: React.SyntheticEvent<any>,
    { name }: { name: string }
  ) => {
    Router.push(name);
  };

  isActiveClass = (current: ActiveType): string =>
    this.props.active === current ? "active" : "";

  render() {
    return (
      <Nav className="main-header">
        <Items className="items">
          <Item>
            <Link href={"/view"}>
              <AppIcon src="/static/logo.png" alt="nteract logo" />
            </Link>
          </Item>
          <Item className={this.isActiveClass("view")}>
            <Link href={"/view"}>
              <a>Browse</a>
            </Link>
          </Item>
          <Item className={this.isActiveClass("s3-view")}>
            <Link href={"/s3-artifacts"}>
              <a>Job Artifacts</a>
            </Link>
          </Item>
        </Items>
        <MetadataItems>
          {this.props.kernel ? (
            <Kernel style={{ color: "black" }}>
              Kernel: {this.props.kernel}
            </Kernel>
          ) : null}
        </MetadataItems>
      </Nav>
    );
  }
}

export default CommuterMenu;
