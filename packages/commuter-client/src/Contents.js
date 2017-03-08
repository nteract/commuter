import React, { PropTypes as T } from "react";
import { connect } from "react-redux";

import { fetchContents } from "./actions";

import "normalize.css/normalize.css";

import { Container } from "semantic-ui-react";

import { css } from "aphrodite";

import { styles } from "./stylesheets/commuter";

class Contents extends React.Component {
  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname)
      this.loadData(nextProps);
  }

  loadData = ({ location, dispatch }) =>
    dispatch(fetchNotebook(location.pathname));

  render() {
    return (
      <Container className={css(styles.outerContainer)}>
        {this.props.isFetching || !this.props.contents
          ? <div> Loading ... </div>
          : <pre>{this.props.contents}</pre>}
      </Container>
    );
  }
}

Notebook.propTypes = {
  contents: T.object,
  isFetching: T.bool.isRequired,
  location: T.shape({
    pathname: T.string.isRequired
  })
};

const mapStateToProps = state => ({
  contents: state.commuter.contents,
  isFetching: state.commuter.isFetching
});

export default connect(mapStateToProps)(Contents);
