import React from "react";
import { Icon, Table } from "semantic-ui-react";
import { Link } from "react-router";

const ContentTable = props => <Table basic="very" padded>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell colSpan="2">Listing</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {props.content.map((row, index) => {
        switch (row.type) {
          case "notebook":
            return (
              <Table.Row key={index}>
                <Table.Cell>
                  <Link to={
                    row.path
                  }><Icon name="book" color="grey" />{row.name}</Link>
                </Table.Cell>
                <Table.Cell collapsing textAlign="right"></Table.Cell>
              </Table.Row>
            );
          case "directory":
            return (
              <Table.Row key={index}>
                <Table.Cell collapsing>
                  <Link to={
                    row.path
                  }><Icon name="folder" color="blue" />{row.name}</Link>
                </Table.Cell>
                <Table.Cell collapsing textAlign="right"></Table.Cell>
              </Table.Row>
            );
          case "file":
            return (
              <Table.Row key={index}>
                <Table.Cell collapsing>
                  <Link to={
                    row.path
                  }><Icon name="file" color="grey" />{row.name}</Link>
                </Table.Cell>
                <Table.Cell collapsing textAlign="right"></Table.Cell>
              </Table.Row>
            );
          default:
            return null;
        }
      })}
  </Table.Body>
</Table>;

export default ContentTable;
