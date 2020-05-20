import * as React from "react";
import NextLink from "next/link";
import { ObjectVersionList, ObjectVersion } from "aws-sdk/clients/s3";
import { Drawer, HTMLTable } from "@blueprintjs/core";
import moment from "moment-timezone";
import fetch from "isomorphic-unfetch";
import { BrowseLink, BrowseHeaderProps } from "../browse-header";

interface VersionDrawerState {
  objectVersionArray: ObjectVersionList;
}

// LastModified is only a Date on the server side. When transmitted over the wire it
// becomes a string. For type safety
type WireObjectVersion = Omit<ObjectVersion, "LastModified"> & {
  LastModified?: string;
};

interface VersionDrawerProps extends BrowseHeaderProps {
  handleOpen: () => void;
  handleClose: () => void;
  versionIsOpen: boolean;
}

const VersionLink = ({
  to,
  children,
  basepath,
  versionId,
  key,
}: {
  to: string;
  children: React.ReactElement;
  basepath: string;
  versionId: string;
  key: string;
}) =>
  // AWS S3 versions return the string "null" for the latest version of an object
  // in this case we want to return the bare URL with a standard Link
  versionId === "null" ? (
    <BrowseLink key={key} to={to} basepath={basepath}>
      {children}
    </BrowseLink>
  ) : (
    <NextLink
      href={{
        pathname: basepath,
        query: { viewPath: to, VersionId: versionId },
      }}
      as={`${basepath}/${to}?VersionId=${versionId}`}
      key={key}
    >
      {children}
    </NextLink>
  );

export class VersionDrawer extends React.Component<
  VersionDrawerProps,
  VersionDrawerState
> {
  constructor(props: VersionDrawerProps) {
    super(props);
    this.state = { objectVersionArray: [] };
  }

  componentDidMount() {
    this.updateObjectVersionArray();
  }

  async updateObjectVersionArray() {
    const versionUrl = `/api/s3-contents/versions/${this.props.path}`;
    const versionXhr = await fetch(versionUrl).then((res) => res.json());

    this.setState({
      objectVersionArray: versionXhr.map((obv: WireObjectVersion) => {
        // If there is no Last Modified date, keep the ObjectVersion as is
        if (obv.LastModified === undefined || obv.LastModified === null) {
          return obv;
        }
        // Convert from UTCString to Date
        return Object.assign(
          {},
          { LastModified: new Date(obv.LastModified) },
          obv
        );
      }),
    });
  }

  componentWillUnmount() {
    this.props.handleClose ? this.props.handleClose() : null;
  }

  componentDidUpdate(prevProps: VersionDrawerProps) {
    if (this.props.path !== prevProps.path) {
      this.props.handleClose();
      this.updateObjectVersionArray();
    }
  }

  render() {
    return (
      <Drawer
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        isOpen={this.props.versionIsOpen}
        position={"right"}
        onClose={this.props.handleClose}
        hasBackdrop={false}
        size={"30%"}
        portalClassName={"custom-bp-overlay"}
        style={{ overflow: "scroll" }}
      >
        <HTMLTable striped={true} interactive={true}>
          <thead>
            <tr>
              <th>Version ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {this.state.objectVersionArray.map(
              (versionObject: ObjectVersion, index, array) => {
                // AWS S3 versions return the string "null" for the latest version of an object
                // When there are no versions, we can regard the only version as the latest version unconditonally
                const versionId = versionObject.VersionId || "null";
                const versionName =
                  versionId === "null"
                    ? "Current Version"
                    : `Version - ${array.length - index}`;

                if (!versionObject.LastModified) {
                  return null;
                }

                const dateFormat: string = "ddd, MMM Do YYYY, h:mm:ss A";
                const lastModified = moment(versionObject.LastModified)
                  .tz(moment.tz.guess())
                  .format(dateFormat);

                return (
                  <VersionLink
                    to={this.props.path}
                    basepath={this.props.basepath}
                    versionId={versionId}
                    key={versionId}
                  >
                    <tr>
                      <td>{versionName}</td>
                      <td>{lastModified}</td>
                    </tr>
                  </VersionLink>
                );
              }
            )}
          </tbody>
        </HTMLTable>
      </Drawer>
    );
  }
}
