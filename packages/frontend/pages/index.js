// @flow
import React from "react";
import Link from "next/link";

class IndexPage extends React.Component {
  static async getInitialProps(ctx) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: "/view/" });
      ctx.res.end();
    } else {
      document.location.pathname = "/view/";
    }
    return {};
  }

  render() {
    return (
      <div>
        Redirecting to{" "}
        <Link href="/view">
          <a>/view</a>
        </Link>
      </div>
    );
  }
}

export default IndexPage;
