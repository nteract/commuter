import React, { PropTypes as T } from "react";
import { connect } from "react-redux";

import { Container, Divider, Image } from "semantic-ui-react";
import { css } from "aphrodite";

import DirectoryListing from "@nteract/commuter-directory-listing";
import BreadCrumb from "@nteract/commuter-breadcrumb";

import { fetchContents } from "./actions";

import { styles } from "./stylesheets/commuter";
import logo from "./static/logo.png";

class Commuter extends React.Component {
  static contextTypes = { router: T.object.isRequired };
  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname)
      this.loadData(nextProps);
  }

  loadData = ({ location, dispatch }) =>
    dispatch(fetchContents(location.pathname));

  handleClick = path => this.context.router.push(path);

  render() {
    const { pathname } = this.props.location;
    return (
      <Container className={css(styles.outerContainer)}>
        <Image src={logo} size="small" />
        <Divider className={css(styles.divider)} section />
        <BreadCrumb path={pathname} onClick={this.handleClick} />
        <Container className={css(styles.innerContainer)} textAlign="center">
          <DirectoryListing
            path={pathname}
            contents={this.props.contents}
            onClick={this.handleClick}
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
