import React from "react";
import Link from "next/link";
require("isomorphic-fetch");

import { join as pathJoin } from "path";

import DirectoryListing from "../components/contents/directory-listing";

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

    if (this.props.contents.type !== "directory") {
      return (
        <pre>
          {JSON.stringify(this.props.contents, null, 2)}
        </pre>
      );
    }

    return (
      <DirectoryListing
        contents={this.props.contents.content}
        basepath="/view"
      />
    );
  }
}

export default ViewPage;
