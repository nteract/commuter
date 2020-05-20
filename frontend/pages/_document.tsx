import * as React from "react";
import Document, {
  Head,
  Main,
  NextScript,
  DocumentContext
} from "next/document";

import { ServerStyleSheet } from "styled-components";

// @ts-ignore -- katex includes version as part of its export
import { version as katexVersion } from "katex";

class MyDocument extends Document {
  // Originally ripped from
  // https://github.com/zeit/next.js/blob/master/examples/with-styled-components/pages/_document.js
  static async getInitialProps(ctx: DocumentContext) {
    // Create the stylesheet for styled-components to write to on the server side
    // and recollect on the client side
    const sheet = new ServerStyleSheet();
    // We'll be overriding the way pages are rendered in order to flush css-in-js styles,
    // and so we'll need to keep a way to render the page as is
    // See: https://github.com/zeit/next.js/blob/bf69357f2777c6ac7f25e012b0be92765f968097/packages/next/README.md#customizing-renderpage
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          // Retrieve styles from components in the page
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        });

      // Run the parent `getInitialProps` using `ctx` that now includes our custom `renderPage`
      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {/* Styles flushed from next.js */}
            {initialProps.styles}
            {/* Styles flushed from styled-components */}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      // There should not be no more style additions serverside at this point, and we seal to
      // eliminate memory leaks
      sheet.seal();
    }
  }

  render() {
    return (
      <html lang="en-US">
        <Head>
          <link
            rel="stylesheet"
            // NOTE: Because of fonts we are (currently) unable to use the CSS loader for
            //       katex. Webpack throws "ModuleParseError: Module parse failed: Unexpected character ''"
            //       during build. Instead we're just pulling from the CDN and matching the version number here
            //       In the future, this should somehow become part of the build
            href={`https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex.min.css`}
            integrity="sha384-dbVIfZGuN1Yq7/1Ocstc1lUEm+AT+/rCkibIcC/OmWo5f0EA48Vf8CytHzGrSwbQ"
            crossOrigin="anonymous"
          />

          <link rel="apple-touch-icon" href="/static/apple-touch-icon.png" />

          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/static/android-chrome-192x192.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon-32x32.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon-16x16.png"
          />

          <meta
            name="msapplication-TileImage"
            content="/static/mstile-150x150.png"
          />
          <link rel="shortcut icon" href="/static/favicon.ico" />

          <link
            href="https://fonts.googleapis.com/css?family=Source+Code+Pro:200,300,400,500,600,700,900&amp;subset=latin-ext"
            rel="stylesheet"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic"
            rel="stylesheet"
            type="text/css"
          />
          <link rel="stylesheet" type="text/css" href="/static/commuter.css" />

          <script src="https://cdn.plot.ly/plotly-latest.min.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
