import React from "react";
import Link from "next/link";

global.navigator = {};

import Contents from "../original-client/contents";

class ViewPage extends React.Component {
  static async getInitialProps({ req }) {
    // Later, we'll use this to fill in the notebook
    // file data from the server side (or fallback to /api/contents)
    // For now, leaving "server": boolean to assist in debugging
    // during the refactor
    // The best choice will be to rely only on client side for now
    // I'm sure
    return req ? { server: true } : { server: false };
  }

  render() {
    console.log("props: ", this.props);

    // TODO: navigator won't be defined on server side for codemirror, we need
    //       to hack around it

    return (
      <div>
        <p>view it</p>
        <Link href="/view">
          <a>view</a>
        </Link>
        {this.props.server ? null : <Contents />}

        <pre>
          {JSON.stringify(this.props.url.query.viewPath)}
        </pre>
      </div>
    );
  }
}

export default ViewPage;
