import React from "react";
import { Container } from "semantic-ui-react";
import NotebookPreview from "notebook-preview";

import "notebook-preview/styles/theme-light.css";

export default class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notebook: null };
  }

  componentDidMount() {
    this.loadData(this.props.params);
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps.params);
  }

  loadData = ({ splat }) =>
    fetch(`/api/contents/${splat}`)
      .then(res => res.json())
      .then(notebook => this.setState({ notebook }));

  render() {
    return (
      <Container>
        {this.state.notebook
          ? <NotebookPreview notebook={this.state.notebook} />
          : <div> Loading ... </div>}
      </Container>
    );
  }
}
