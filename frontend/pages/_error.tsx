/**
 * Custom error handling for production environment. By default,
 * 404 and 500 errors are handled both client and server side by a
 * `error.js` component. This file overrides `error.js` by being
 * in the `pages` folder.
 *
 * Code taken from NEXT.js documentation.
 * https://nextjs.org/docs/#custom-error-handling
 */

// Vendor imports
import React from "react";

import { NextPageContext } from "next";

interface ErrorProps {
  statusCode: number | null;
}

class Error extends React.Component<ErrorProps> {
  static getInitialProps(ctx: NextPageContext): ErrorProps {
    const { res, err } = ctx;

    const statusCode: number | null = res
      ? res.statusCode
      : err && err.statusCode
      ? err.statusCode
      : null;

    return { statusCode };
  }

  render() {
    return (
      <p>
        {this.props.statusCode
          ? `An error ${this.props.statusCode} occurred on server`
          : `An error occurred on client`}
      </p>
    );
  }
}

export default Error;
