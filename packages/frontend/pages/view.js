import React from "react";
import Link from "next/link";

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
    return (
      <div>
        <p>view it</p>
        <Link href="/view">
          <a>view</a>
        </Link>

        <pre>
          {JSON.stringify(this.props.url.query.viewPath)}
        </pre>
      </div>
    );
  }
}

export default ViewPage;
