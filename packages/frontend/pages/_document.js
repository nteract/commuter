import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(stuff) {
    // Later, we'll use this to fill in the notebook
    // file data from the server side (or fallback to /api/contents)
    // For now, leaving "server": boolean to assist in debugging
    // during the refactor
    // The best choice will be to rely only on client side for now
    // I'm sure
    console.log("pathname ", stuff.pathname);
    console.log("asPath", stuff.asPath);
    const req = stuff.req;
    // console.log("from document", req);
    return req
      ? {
          server: true,
          pth: req.params[0] || "/",
          test: { params: req.params, query: req.query, url: req.url }
        }
      : { server: false, test: "x____x" };
  }

  render() {
    // console.log("from document", this.props);
    return (
      <html>
        <Head>
          <title>Dynamic title</title>
          <base href="/trial" />
        </Head>
        <body>
          <div className="root">
            <Main />
            <NextScript />
          </div>
        </body>
      </html>
    );
  }
}
