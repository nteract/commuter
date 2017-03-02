import React from "react";
import { connect } from "react-redux";

import TimeAgo from "react-timeago";

import { discoverNotebooks } from "./actions";

import "normalize.css/normalize.css";

import { Container, Icon, Item } from "semantic-ui-react";

import { css } from "aphrodite";

import { styles } from "./stylesheets/commuter";

const Authors = props => (
  <span className="authors">
    {props.authors.map(author => author.name).join(", ")}
  </span>
);

const DiscoveryItem = props => (
  <Item key={props.path}>
    <Item.Image
      size="small"
      src={props.image ? props.image : "https://icon.now.sh/library_books/64"}
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
        {props.metadata.nteract.tags.map(tag => (
          <a key={tag}><Icon name="tag" />{tag}</a>
        ))}
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
