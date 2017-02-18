import React, { PropTypes as T } from "react";
import { Table, Grid, Segment, Icon } from "semantic-ui-react";

const DirectoryListing = props => {
  const handleClick = path => e => {
    if (props.onClick) {
      e.preventDefault();
      props.onClick(path);
    }
  };

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
                          <a
                            href={`${row.path}`}
                            onClick={handleClick(`${row.path}`)}
                          >
                            <Icon name="book" color="grey" />{row.name}
                          </a>
                        </Table.Cell>
                        <Table.Cell collapsing textAlign="right" />
                      </Table.Row>
                    );
                  case "directory":
                    return (
                      <Table.Row key={index}>
                        <Table.Cell collapsing>
                          <a
                            href={`${row.path}`}
                            onClick={handleClick(`${row.path}`)}
                          >
                            <Icon name="folder" color="blue" />{row.name}
                          </a>
                        </Table.Cell>
                        <Table.Cell collapsing textAlign="right" />
                      </Table.Row>
                    );
                  case "file":
                    return (
                      <Table.Row key={index}>
                        <Table.Cell collapsing>
                          <a href={row.path} onClick={handleClick(row.path)}>
                            <Icon name="file" color="grey" />{row.name}
                          </a>
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
  handleClick: T.func,
  onClick: T.func
};

export default DirectoryListing;
