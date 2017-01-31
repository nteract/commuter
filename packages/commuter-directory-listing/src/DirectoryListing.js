import React, { PropTypes as T } from "react";
import { Grid, Segment } from "semantic-ui-react";

import ContentTable from "./components/Table";

const jupyter = require("rx-jupyter");

export default class DirectoryListing extends React.Component {
  static propTypes = {
    path: T.string.isRequired,
    serverConfig: T.shape({ endpoint: T.string.isRequired }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = { content: [] };
  }

  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps);
  }

  loadData = ({ path }) =>
    jupyter.contents
      .get(this.props.serverConfig, path)
      .subscribe(res => this.setState({ content: res.response.content }));

  render() {
    return (
      <Grid>
        <Grid.Column>
          <Segment>
            <ContentTable content={this.state.content} path={this.props.path} />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
