// @flow
import Head from "next/head";
import Link from "next/link";
import React from "react";

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
  url: {
    query: {
      path: string
    }
  }
};

export default class extends React.Component {
  props: ViewProps;

  static async getInitialProps(ctx: Context): Promise<InitialProps> {
    console.log(process);
    console.log("ctx", ctx.query);
    return {
      basePath: ctx.query.path
    };
  }
  render() {
    const basePath = this.props.url.query.path || this.props.basePath;
    console.log(basePath);
    console.log(this.props.url.query);

    return (
      <div>
        <Head>
          <title>Listing {basePath}</title>
        </Head>
        <pre>{basePath}</pre>
        <Link
          href={`/view?path=/somewhere/awesome`}
          as="/view/somewhere/awesome"
        >
          <a>somewhere/awesome</a>
        </Link>
      </div>
    );
  }
}
