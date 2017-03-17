// @flow
import Head from "next/head";
import React from "react";

import type http from "http";

type Context = {
  req?: http.IncomingMessage, // server only
  res?: http.ServerResponse, // server only
  pathname: string,
  query: Object,
  jsonPageRes?: Response, // client only
  err: Error
};

type ViewProps = {
  userAgent: string
};

export default class extends React.Component {
  props: ViewProps;

  static async getInitialProps({ req }: Context): Promise<ViewProps> {
    return req
      ? { userAgent: req.headers["user-agent"] }
      : { userAgent: navigator.userAgent };
  }
  render() {
    return (
      <div>
        <Head>
          <title>Content yay</title>
        </Head>
        <pre>{this.props.userAgent}</pre>
      </div>
    );
  }
}
