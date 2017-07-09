import React from "react";
import Link from "next/link";

// import Contents from "../original-client/contents";

class ViewPage extends React.Component {
  static async getInitialProps({ req }) {
    // Later, we'll use this to fill in the notebook
    // file data from the server side (or fallback to /api/contents)
    // For now, leaving "server": boolean to assist in debugging
    // during the refactor
    // The best choice will be to rely only on client side for now
    // I'm sure
    return req
      ? {
          server: true,
          pth: req.params[0] || "/",
          test: { params: req.params, query: req.query, url: req.url }
        }
      : { server: false, test: "x" };
  }

  render() {
    // console.log(this.props);
    return (
      <div>
        <p>view it</p>
        <Link href="/view">
          <a>view</a>
        </Link>
        {this.props.server ? <pre>server</pre> : <pre>client</pre>}

        <pre>
          {JSON.stringify(this.props.url.query.viewPath)}
        </pre>
      </div>
    );
  }
}

export default ViewPage;
