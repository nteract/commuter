// @flow
import React from "react";
import Head from "next/head";
import Link from "next/link";
import NProgress from "nprogress";
import Router from "next/router";

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
          <li>
            <Link href={"/view"}>
              <img src="/static/logo.png" />
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
          nav {
            background: #edf1f7;
            border: 1px solid #c8d4e7;
            font-family: "Source Sans Pro";
            font-size: 16px;
            color: #a2b6d7;
            padding-left: 1.5em;
          }

          img {
            padding-right: 1em;
          }

          ul {
            display: flex;
            width: 100%;
            position: relative;

            margin: 0;
            padding: 0;
            text-align: center;

            list-style: none;
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
            color: #a2b6d7;
          }

          ul li.active a {
            color: #324767;
            font-weight: 500;
            text-decoration: none;
            cursor: default;
          }

          a:hover {
            text-decoration: underline;
          }

          img {
            height: 3rem;
            vertical-align: middle;
          }
        `}</style>
      </nav>
    );
  }
}

export default CommuterMenu;
