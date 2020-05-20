import * as React from "react";
import Link from "next/link";

import { NextPageContext } from "next";

class IndexPage extends React.Component<null> {
  static async getInitialProps(ctx: NextPageContext) {
    if (ctx.res) {
      // Server side, do a redirect using the HTTP response object
      ctx.res.writeHead(302, { Location: "/view/" });
      ctx.res.end();
    } else {
      // Client side redirect
      document.location.pathname = "/view/";
    }
    return {};
  }

  render() {
    return (
      <React.Fragment>
        Redirecting to{" "}
        <Link href="/view">
          <a>/view</a>
        </Link>
      </React.Fragment>
    );
  }
}

export default IndexPage;
