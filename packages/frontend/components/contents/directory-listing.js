import React, { PropTypes as T } from "react";
import { Table, Grid, Icon } from "semantic-ui-react";

import NextLink from "next/link";

// Convert simple links to next style href + as
const Link = ({ to, children, basepath }) =>
  <NextLink
    href={{ pathname: "/view", query: { viewPath: to } }}
    as={basepath + "/" + to}
  >
    <a>
      {children}
    </a>
  </NextLink>;

const DirectoryListing = props => {
  const base = props.basepath || "/";
  return (
    <Grid>
      <Grid.Column>
        <Table basic="very" padded>
          <Table.Header>
            <Table.Row />
          </Table.Header>
          <Table.Body>
            {props.contents.map((row, index) => {
              if (!row.type) {
                return null;
              }
              switch (row.type) {
                case "notebook":
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Link to={row.path} basepath={base}>
                          <Icon name="book" color="grey" />
                          {row.name}
                        </Link>
                      </Table.Cell>
                      <Table.Cell collapsing textAlign="right" />
                    </Table.Row>
                  );
                case "directory":
                  return (
                    <Table.Row key={index}>
                      <Table.Cell collapsing>
                        <Link to={row.path} basepath={base}>
                          <Icon name="folder" color="blue" />
                          {row.name}
                        </Link>
                      </Table.Cell>
                      <Table.Cell collapsing textAlign="right" />
                    </Table.Row>
                  );
                case "file":
                  return (
                    <Table.Row key={index}>
                      <Table.Cell collapsing>
                        <Link to={row.path} basepath={base}>
                          <Icon name="file" color="grey" />
                          {row.name}
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
