import React from "react";
import Link from "next/link";
require("isomorphic-fetch");

import { join as pathJoin } from "path";

// import Contents from "../original-client/contents";

class ViewPage extends React.Component {
  static async getInitialProps({ req, pathname, asPath, query }) {
    // Later, we'll use this to fill in the notebook
    // file data from the server side (or fallback to /api/contents)
    // For now, leaving "server": boolean to assist in debugging
    // during the refactor
    // The best choice will be to rely only on client side for now
    // I'm sure

    const contentPath = query.viewPath;

    let BASE_PATH;

    if (req) {
      // Server side via `req`
      // TODO: Use me
      const viewPath = (req && req.params && req.params[0]) || "/";

      const port = process.env.COMMUTER_PORT || 4000;
      BASE_PATH = `http://127.0.0.1:${port}/`;
    } else {
      BASE_PATH = "/";
    }

    const url = `${BASE_PATH}api/contents/${contentPath}`;
    console.log("url", url);

    const contents = await fetch(url).then(x => x.json());

    return {
      contents
    };
  }

  render() {
    const href = {
      pathname: "/view",
      query: { viewPath: "README.md" }
    };

    const as = {
      pathname: "/view/README.md"
    };

    // console.log(this.props);
    return (
      <div>
        <p>view it</p>
        <Link href={href} as={as}>
          <a>view README</a>
        </Link>
        <Link
          href={{ pathname: "/view", query: { viewPath: "package.json" } }}
          as={{ pathname: "/view/package.json" }}
        >
          <a>view package.json</a>
        </Link>
        {this.props.server ? <pre>server</pre> : <pre>client</pre>}

        <pre>
          {JSON.stringify(this.props.contents)}
        </pre>

        <pre>
          {JSON.stringify(this.props.url.query.viewPath)}
        </pre>
      </div>
    );
  }
}

export default ViewPage;
