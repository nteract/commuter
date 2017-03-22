import React, { PropTypes as T } from "react";
import { connect } from "react-redux";

import { Container } from "semantic-ui-react";
import { css } from "aphrodite";

import DirectoryListing from "@nteract/commuter-directory-listing";
import BreadCrumb from "@nteract/commuter-breadcrumb";

import { fetchContents } from "./actions";

import { styles } from "./stylesheets/commuter";

import stripView from "./strip-view";

class Commuter extends React.Component {
  static contextTypes = { router: T.object.isRequired };
  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname)
      this.loadData(nextProps);
  }

  handleClick = path => this.props.history.push(path);

  loadData = ({ location, dispatch }) =>
    dispatch(fetchContents(stripView(location.pathname)));

  render() {
    const pathname = stripView(this.props.location.pathname);
    return (
      <Container className={css(styles.outerContainer)}>
        <BreadCrumb path={pathname} onClick={this.handleClick} />
        <Container className={css(styles.innerContainer)} textAlign="center">
          <DirectoryListing
            onClick={this.handleClick}
            path={this.props.location.pathname}
            contents={this.props.contents}
            basepath={"/view"}
          />
        </Container>
      </Container>
    );
  }
}

Commuter.propTypes = {
  contents: T.array.isRequired,
  isFetching: T.bool.isRequired,
  location: T.shape({
    pathname: T.string.isRequired
  })
};

const mapStateToProps = state => {
  return {
    contents: state.commuter.contents,
    isFetching: state.commuter.isFetching
  };
};

export default connect(mapStateToProps)(Commuter);
