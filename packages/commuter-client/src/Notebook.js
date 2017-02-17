import React, { PropTypes as T } from "react";
import { connect } from "react-redux";

import NotebookPreview from "notebook-preview";

import { fetchNotebook } from "./actions";

import "normalize.css/normalize.css";
import "codemirror/lib/codemirror.css";
import "notebook-preview/styles/main.css";
import "notebook-preview/styles/theme-light.css";

class Notebook extends React.Component {
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
      <div>
        {this.props.isFetching
          ? <div> Loading ... </div>
          : <NotebookPreview notebook={this.props.notebook} />}
      </div>
    );
  }
}

Notebook.propTypes = {
  notebook: T.object,
  isFetching: T.bool.isRequired,
  location: T.shape({
    pathname: T.string.isRequired
  })
};

const mapStateToProps = state => ({
  notebook: state.notebook.rawJson,
  isFetching: state.notebook.isFetching
});

export default connect(mapStateToProps)(Notebook);
