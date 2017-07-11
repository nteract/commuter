import Document, { Head, Main, NextScript } from "next/document";

import flush from "styled-jsx/server";

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <html lang="en-US">
        <Head>
          <style>{`body { margin: 0 } /* custom! */`}</style>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
          />
          <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />

          <link
            href="https://static-tfoouzpgyq.now.sh/codemirror.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://static-tfoouzpgyq.now.sh/main.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://static-tfoouzpgyq.now.sh/nbp.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://static-tfoouzpgyq.now.sh/theme-light.css"
            rel="stylesheet"
            type="text/css"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Source+Code+Pro:400,700,300,200,500,600,900"
            rel="stylesheet"
            type="text/css"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,200italic,300,300italic,400italic,600,600italic,700,700italic,900,900italic"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
