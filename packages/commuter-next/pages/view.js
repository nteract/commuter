// @flow
import Head from "next/head";
import Link from "next/link";
import React from "react";

import { Divider, Image } from "semantic-ui-react";
import { Container } from "semantic-ui-react";

import { Entry } from "../components/contents";

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
  contents: Object
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
      contents: json,
      basePath
    };
  }

  handleClick = (path: string) => console.log(path);

  render() {
    const pathname = this.props.basePath;

    if (!this.props.contents) {
      return null;
    }

    const entry = {};

    return (
      <div>
        <Head>
          <title>Listing {pathname}</title>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Source+Code+Pro:400,700,300,200,500,600,900"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic"
            rel="stylesheet"
            type="text/css"
          />

        </Head>
        <div>
          <Image src="/static/logo.png" size="small" />
          <Divider className="divider" section />
        </div>
        <style jsx>
          {
            `
          .outer-container: {
            fontFamily: "sans-serif";
          }
          .inner-container: {
            paddingTop: "10px";
          }
          .divider: {
            marginTop: "0rem";
          }
        `
          }
        </style>

        <Container className="outer-container">
          <BreadCrumb path={pathname} onClick={this.handleClick} />
          <Container className="inner-container" textAlign="center">
            <Entry
              pathname={pathname}
              entry={this.props.contents}
              onClick={this.handleClick}
            />
          </Container>
        </Container>
      </div>
    );
  }
}
