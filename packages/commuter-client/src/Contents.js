import React, { PropTypes as T } from "react";
import { connect } from "react-redux";

import DirectoryListing from "@nteract/commuter-directory-listing";
import BreadCrumb from "@nteract/commuter-breadcrumb";

import { fetchContents } from "./actions";

import "normalize.css/normalize.css";

import { Container } from "semantic-ui-react";

import { css } from "aphrodite";

import { styles } from "./stylesheets/commuter";

class File extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <iframe
          sandbox="allow-scripts"
          style={{ width: "100%", height: "100%", border: "none" }}
          srcDoc={this.props.entry.content}
          ref={f => {
            this.ifr = f;
          }}
          height="100%"
          width="100%"
        />
      </div>
    );
  }
}

const Entry = props => {
  switch (props.entry.type) {
    case "directory":
      return (
        <DirectoryListing
          path={props.pathname}
          contents={props.entry.content}
          onClick={props.handleClick}
        />
      );
    case "file":
      return <File entry={props.entry} />;
    default:
      return <pre>{JSON.stringify(props.entry.content)}</pre>;
  }
};

class Contents extends React.Component {
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
        <BreadCrumb path={pathname} onClick={this.handleClick} />
        <Container className={css(styles.innerContainer)} textAlign="center">
          {
            <Entry
              entry={this.props.entry}
              pathname={pathname}
              handleClick={this.handleClick}
            />
          }
        </Container>
      </Container>
    );
  }
}

Contents.propTypes = {
  entry: T.object, //  object,
  isFetching: T.bool.isRequired,
  location: T.shape({
    pathname: T.string.isRequired
  })
};

const mapStateToProps = state => ({
  entry: state.commuter.entry,
  isFetching: state.commuter.isFetching
});

export default connect(mapStateToProps)(Contents);
