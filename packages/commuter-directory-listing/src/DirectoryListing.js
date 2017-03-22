import React, { PropTypes as T } from "react";
import { Table, Grid, Segment, Icon } from "semantic-ui-react";

import { Link } from "react-router-dom";

const DirectoryListing = props => {
  const base = props.basepath;
  return (
    <Grid>
      <Grid.Column>
        <Segment>
          <Table basic="very" padded>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2">Listing</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {props.contents.map((row, index) => {
                switch (row.type) {
                  case "notebook":
                    return (
                      <Table.Row key={index}>
                        <Table.Cell>
                          <Link to={`${base}${row.path}`}>
                            <Icon name="book" color="grey" />{row.name}
                          </Link>
                        </Table.Cell>
                        <Table.Cell collapsing textAlign="right" />
                      </Table.Row>
                    );
                  case "directory":
                    return (
                      <Table.Row key={index}>
                        <Table.Cell collapsing>
                          <Link to={`${base}${row.path}`}>
                            <Icon name="folder" color="blue" />{row.name}
                          </Link>
                        </Table.Cell>
                        <Table.Cell collapsing textAlign="right" />
                      </Table.Row>
                    );
                  case "file":
                    return (
                      <Table.Row key={index}>
                        <Table.Cell collapsing>
                          <Link to={`${base}${row.path}`}>
                            <Icon name="file" color="grey" />{row.name}
                          </Link>
                        </Table.Cell>
                        <Table.Cell collapsing textAlign="right" />
                      </Table.Row>
                    );
                  default:
                    return null;
                }
              })}
            </Table.Body>
          </Table>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

DirectoryListing.propTypes = {
  contents: T.arrayOf(
    T.shape({ type: T.string, path: T.string, name: T.string })
  ),
  basepath: T.string
};

export default DirectoryListing;
