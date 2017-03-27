import React, { PropTypes as T } from "react";
import { connect } from "react-redux";

import Immutable from "immutable";

import NotebookPreview from "@nteract/notebook-preview";
import DirectoryListing from "@nteract/commuter-directory-listing";
import BreadCrumb from "@nteract/commuter-breadcrumb";

import JSONTransform from "@nteract/transforms/lib/json";

import "normalize.css/normalize.css";
import "codemirror/lib/codemirror.css";
import "@nteract/notebook-preview/styles/main.css";
import "@nteract/notebook-preview/styles/theme-light.css";

import { fetchContents } from "./actions";

import { Container } from "semantic-ui-react";

import { Redirect } from "react-router-dom";

import { css } from "aphrodite";

import { styles } from "./stylesheets/commuter";
import stripView from "./strip-view";

import ZeppelinView from "./zeppelin";

class HTMLView extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <iframe
          sandbox="allow-scripts"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            position: "absolute",
            left: "10rem"
          }}
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

class File extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    if (this.props.entry.name.endsWith(".html")) {
      return <HTMLView entry={this.props.entry} />;
    }

    // Super mega advanced file detection
    if (this.props.entry.name.endsWith(".json")) {
      const content = JSON.parse(this.props.entry.content);
      try {
        // Zeppelin notebooks are called note.json, we'll go ahead and render them
        if (this.props.entry.name === "note.json") {
          return <ZeppelinView notebook={content} />;
        }

        return (
          <JSONTransform
            data={content}
            metadata={Immutable.Map({
              expanded: true
            })}
          />
        );
      } catch (e) {
        return (
          <div>
            <h1>Failed to parse Zeppelin Notebook</h1>
            <pre>{e.toString()}</pre>
            <code>{this.props.entry.content}</code>
          </div>
        );
      }
    }

    return <Redirect to={`/files${this.props.pathname}`} />;
  }
}

const Entry = props => {
  switch (props.entry.type) {
    case "directory":
      return (
        <Container className={css(styles.innerContainer)} textAlign="center">
          <DirectoryListing
            path={props.pathname}
            contents={props.entry.content}
            onClick={props.handleClick}
            basepath={"/view"}
          />
        </Container>
      );
    case "file":
      // TODO: Case off various file types (by extension, mimetype)
      return <File entry={props.entry} pathname={props.pathname} />;
    case "notebook":
      return <NotebookPreview notebook={props.entry.content} />;
    default:
      console.log("Unknown contents ");
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
    dispatch(fetchContents(stripView(location.pathname)));

  handleClick = path => this.props.history.push(path);

  render() {
    const pathname = stripView(this.props.location.pathname);
    return (
      <Container className={css(styles.outerContainer)}>
        <BreadCrumb
          path={pathname}
          onClick={this.handleClick}
          basepath={"/view"}
        />
        <Entry
          entry={this.props.entry}
          pathname={pathname}
          handleClick={this.handleClick}
        />
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
