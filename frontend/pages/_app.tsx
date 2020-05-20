import * as React from "react";

import App, { Container, AppContext } from "next/app";
import * as gtag from "../gtag";

// Render all elements more consistently amongst browsers
// http://nicolasgallagher.com/about-normalize-css/
import "normalize.css/normalize.css";

//
// The blue progress line users see on content load
// ==========>-------------------------------------
//
import "nprogress/nprogress.css";

// nteract component css deps, especially for data explorer
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

// CSS for the grid view on the data explorer
import "react-table/react-table.css";

// NOTE: Because of fonts we are (currently) unable to use the CSS loader for
//       katex. Webpack throws "ModuleParseError: Module parse failed: Unexpected character ''"
//       during build
// import "katex/dist/katex.css";

import Router from "next/router";

Router.events.on("routeChangeComplete", (url: string) => gtag.pageview(url));

// This is the default setup, only placing it here to make the container nicer
// to work with
export default class MyApp extends App {
  static async getInitialProps(appContext: AppContext) {
    const {
      Component,
      ctx
      // should we be using router.events.on(...) rather than the singleton Router.events.on
      // router
    } = appContext;

    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
