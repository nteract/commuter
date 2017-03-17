// @flow
import Head from "next/head";
import Link from "next/link";
import React from "react";

import type http from "http";

type Context = {
  req?: { params: Array<string> }, // server only
  res?: {}, // server only
  pathname: string,
  query: Object,
  jsonPageRes?: Response, // client only
  err: Error
};

type ViewProps = {
  basePath: string
};

export default class extends React.Component {
  props: ViewProps;

  static async getInitialProps({ req }: Context): Promise<ViewProps> {
    if (req) {
      const basePath = req.params[0];
      return { basePath };
    }
    console.log("seriously?");

    return {
      basePath: "/"
    };
  }
  render() {
    console.log(this.props.basePath);
    return (
      <div>
        <Head>
          <title>Listing {this.props.basePath}</title>
        </Head>
        <pre>{this.props.basePath}</pre>
        <Link href={`/view/somewhere/awesome`}>
          <a>somewhere/awesome</a>
        </Link>
      </div>
    );
  }
}
