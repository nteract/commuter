import React, { PropTypes as T } from "react";
import { connect } from "react-redux";

import NotebookPreview from "@nteract/notebook-preview";
import DirectoryListing from "@nteract/commuter-directory-listing";
import BreadCrumb from "./bread-crumb";

import MarkdownTransform from "@nteract/transforms/lib/markdown";

import "normalize.css/normalize.css";
import "codemirror/lib/codemirror.css";
import "@nteract/notebook-preview/styles/main.css";
import "@nteract/notebook-preview/styles/theme-light.css";

import { fetchContents } from "../actions";

import { Container } from "semantic-ui-react";

import { css } from "aphrodite";

import { styles } from "../stylesheets/commuter";
import stripView from "./strip-view";

import {
  standardTransforms,
  standardDisplayOrder,
  registerTransform
} from "@nteract/transforms";

import DataResourceTransform from "@nteract/transform-dataresource";

const { transforms, displayOrder } = [
  DataResourceTransform
].reduce(registerTransform, {
  transforms: standardTransforms,
  displayOrder: standardDisplayOrder
});

import HTMLView from "./html";
import JSONView from "./json";
import CSVView from "./csv";

const suffixRegex = /(?:\.([^.]+))?$/;

class File extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const name = this.props.entry.name;
    const suffix = (suffixRegex.exec(name)[1] || "").toLowerCase();

    switch (suffix) {
      case "html":
        return <HTMLView entry={this.props.entry} />;
      case "json":
        return <JSONView entry={this.props.entry} />;
      case "csv":
        return (
          <Container fluid className={css(styles.innerContainer)}>
            <CSVView entry={this.props.entry} />
          </Container>
        );
      case "md":
      case "markdown":
      case "rmd":
        return (
          <Container fluid className={css(styles.innerContainer)}>
            <MarkdownTransform
              style={{ paddingLeft: "2rem" }}
              data={this.props.entry.content}
            />
          </Container>
        );
      case "gif":
      case "jpeg":
      case "jpg":
      case "png":
        return (
          <Container fluid className={css(styles.innerContainer)}>
            <img
              src={`/files/${this.props.pathname}`}
              alt={this.props.pathname}
            />
          </Container>
        );
      default:
        return (
          <Container fluid className={css(styles.innerContainer)}>
            <a href={`/files/${this.props.pathname}`}>Download raw file</a>
          </Container>
        );
    }
  }
}

const Entry = props => {
  switch (props.entry.type) {
    case "directory":
      return (
        <Container
          fluid
          className={css(styles.innerContainer)}
          textAlign="center"
        >
          <DirectoryListing
            className={css(styles.listing)}
            path={props.pathname}
            contents={props.entry.content}
            basepath={"/view"}
          />
        </Container>
      );
    case "file":
      // TODO: Case off various file types (by extension, mimetype)
      return <File entry={props.entry} pathname={props.pathname} />;
    case "notebook":
      return (
        <NotebookPreview
          notebook={props.entry.content}
          displayOrder={displayOrder}
          transforms={transforms}
        />
      );
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

  loadData = ({ location, dispatch }) => {
    dispatch(fetchContents(stripView(location.pathname)));
  };

  render() {
    const pathname = stripView(this.props.location.pathname);
    return (
      <Container fluid className={css(styles.outerContainer)}>
        <div
          className={css(styles.listing)}
          style={{
            marginLeft: "2rem"
          }}
        >
          <BreadCrumb path={pathname} basepath={"/view"} />
        </div>
        <Entry entry={this.props.entry} pathname={pathname} />
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
