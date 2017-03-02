import React from "react";
import { connect } from "react-redux";

import TimeAgo from "react-timeago";

import { discoverNotebooks } from "./actions";

import "normalize.css/normalize.css";

import { Container, Item } from "semantic-ui-react";

import { StyleSheet, css } from "aphrodite";

import { styles } from "./stylesheets/commuter";

const Authors = props => (
  <span className="authors">
    {props.authors.map(author => author.name).join(", ")}
  </span>
);

const discoveryStyles = StyleSheet.create({
  item: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
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

const Tag = props => (
  <span className={css(discoveryStyles.tag)}>{props.children}</span>
);

const DiscoveryItem = props => (
  <Item key={props.path} className={css(discoveryStyles.item)}>
    <Item.Image
      size="small"
      src={props.image ? props.image : "https://icon.now.sh/library_books/ccc"}
    />
    <Item.Content>
      <Item.Header as="a" href={props.path}>
        {props.metadata.title ? props.metadata.title : props.name}
      </Item.Header>
      <Item.Meta>
        <span>Last modified <TimeAgo date={props.last_modified} /></span>
        {props.metadata.authors
          ? <span> by <Authors authors={props.metadata.authors} /></span>
          : null}
      </Item.Meta>
      <Item.Description>
        <p>{props.metadata.nteract.description}</p>
      </Item.Description>
      <Item.Extra>
        {props.metadata.nteract.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
      </Item.Extra>
    </Item.Content>
  </Item>
);

class DiscoveryGrid extends React.Component {
  componentDidMount() {
    this.loadData(this.props);
  }

  loadData = ({ dispatch }) => dispatch(discoverNotebooks());

  render() {
    return (
      <Container className={css(styles.outerContainer)}>
        <Item.Group divided>
          {this.props.discovered
            ? this.props.discovered.map(DiscoveryItem)
            : null}
        </Item.Group>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  discovered: state.discovery.discovered
});

export default connect(mapStateToProps)(DiscoveryGrid);
