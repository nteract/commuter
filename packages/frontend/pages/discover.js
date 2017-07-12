import React from "react";
require("isomorphic-fetch");
import TimeAgo from "react-timeago";

import { Container, Menu, Segment, Item } from "semantic-ui-react";

import Header from "../components/header";
import Body from "../components/body";

// import { styles } from "./stylesheets/commuter";

const Authors = props =>
  <span className="authors">
    {props.authors.map(author => author.name).join(", ")}
  </span>;

/*
const discoveryStyles = StyleSheet.create({
  item: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  },
  tag: {
    display: "inline-block",
    padding: "0.2em 0.9em",
    margin: "0 0.5em 0.5em 0",
    whiteSpace: "nowrap",
    backgroundColor: "#f1f8ff",
    borderRadius: "3px",
    color: "#0366d6",
    textDecoration: "none",
    ":hover": {
      backgroundColor: "#ddeeff"
    }
  }
});
*/

const Tag = props =>
  <span>
    <span className="tag">
      {props.children}
    </span>
    <style jsx>{`
    .tag {
      display: "inline-block";
      padding: "0.2em 0.9em";
      margin: "0 0.5em 0.5em 0";
      white-space: "nowrap";
      background-color: "#f1f8ff";
      border-radius: "3px";
      color: "#0366d6";
      text-decoration: "none";
      /* Nesting not supported...
       ":hover": {
        backgroundColor: "#ddeeff";
      }*/
    }
    }
    `}</style>
  </span>;

const DiscoveryItem = props =>
  <div>
    <Item key={props.path}>
      <Item.Image
        size="small"
        src={
          props.image ? props.image : "https://icon.now.sh/library_books/ccc"
        }
      />
      <Item.Content>
        <Item.Header as="a" href={`/view/${props.path}`}>
          {props.metadata.title ? props.metadata.title : props.name}
        </Item.Header>
        <Item.Meta>
          <span>
            Last modified <TimeAgo date={props.last_modified} />
          </span>
          {props.metadata.authors
            ? <span>
                by <Authors authors={props.metadata.authors} />
              </span>
            : null}
        </Item.Meta>
        <Item.Description>
          <p>
            {props.metadata.nteract.description}
          </p>
        </Item.Description>
        <Item.Extra>
          {props.metadata.nteract.tags.map(tag =>
            <Tag key={tag}>
              {tag}
            </Tag>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
    <style jsx>{`
      .item {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
          Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
      }
    `}</style>
  </div>;

class DiscoveryGrid extends React.Component {
  static async getInitialProps({ req, pathname, asPath, query }) {
    let BASE_PATH;

    if (req) {
      const port = process.env.COMMUTER_PORT || 4000;
      BASE_PATH = `http://127.0.0.1:${port}/`;
    } else {
      BASE_PATH = "/";
    }

    const url = `${BASE_PATH}api/v1/discovery`;
    const res = await fetch(url);

    const statusCode = res.status > 200 ? res.status : false;

    const json = await res.json();

    return {
      discovered: json.results,
      statusCode
    };
  }

  render() {
    if (this.props.discovered.length === 0) {
      return (
        <div>
          <Header />
          <Body>
            <h1>No discoveries...</h1>
          </Body>
        </div>
      );
    }

    return (
      <div>
        <Header />
        <Body>
          <Item.Group divided>
            {this.props.discovered
              ? this.props.discovered.map(DiscoveryItem)
              : null}
          </Item.Group>
        </Body>
      </div>
    );
  }
}

export default DiscoveryGrid;
