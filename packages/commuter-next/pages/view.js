// @flow
import Head from "next/head";
import Link from "next/link";
import React from "react";

import { Container } from "semantic-ui-react";
import { css } from "aphrodite";

import DirectoryListing from "@nteract/commuter-directory-listing";
import BreadCrumb from "@nteract/commuter-breadcrumb";

import "isomorphic-fetch";

const { listObjects } = require("./../services/s3");
const isDir = path => !path || (path && path.endsWith("/"));

function listObjectsP(p) {
  return new Promise((resolve, reject) => {
    // TODO: listObjects doesn't obey the (err, data) node standard
    listObjects(p, resolve);
  });
}

import type http from "http";

type Context = {
  req?: { params: Array<string> }, // server only
  res?: {}, // server only
  pathname: string,
  query: {
    path: string
  },
  jsonPageRes?: Response, // client only
  err: Error
};

type InitialProps = {
  basePath: string
};

type ViewProps = {
  basePath: string,
  content: Object
};

export default class extends React.Component {
  props: ViewProps;

  static async getInitialProps(ctx: Context): Promise<InitialProps> {
    const basePath = ctx.query.path || "/";

    let contentsAPI = `/api/contents${basePath}`;
    if (!process.browser) {
      const port = process.env.COMMUTER_PORT || 4000;
      contentsAPI = `http://127.0.0.1:${port}${contentsAPI}`;
    }

    const res = await fetch(contentsAPI);
    const json = await res.json();

    return {
      content: json,
      basePath
    };
  }
  render() {
    return (
      <div>
        <Head>
          <title>Listing {this.props.basePath}</title>
        </Head>
        <pre>{this.props.basePath}</pre>
        <pre>{JSON.stringify(this.props.content, null, 2)}</pre>

        <Container className={css(styles.outerContainer)}>
          <BreadCrumb path={pathname} onClick={this.handleClick} />
          <Container className={css(styles.innerContainer)} textAlign="center">
            <DirectoryListing
              path={pathname}
              contents={this.props.contents}
              onClick={this.handleClick}
            />
          </Container>
        </Container>
      </div>
    );
  }
}
