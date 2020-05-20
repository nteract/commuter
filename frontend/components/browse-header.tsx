import * as React from "react";
import Router from "next/router";
import NextLink from "next/link";
import styled from "styled-components";

import { trim } from "lodash";

import { theme } from "../theme";
import CloneButton from "./headers/clone";
import { VersionDrawer } from "./headers/versionDrawer";
import HideCodeButton from "./headers/hide-code-button";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${theme.outline};
  padding: 0 1rem;
`;

const BreadCrumbs = styled.ul`
  display: flex;
  position: relative;

  margin: 0 0 0 0;
  padding: 0;

  list-style: none;
  background: #ffffff;
  font-family: "Source Sans Pro";
  font-size: 16px;
  color: ${theme.primary};
`;
const BreadCrumbItem = styled.li`
  flex-direction: row;
  list-style-type: none;
  display: inline;
  text-align: center;
  display: flex;
  align-items: center;

  a {
    vertical-align: middle;
    display: table;
    padding: 1em;
    color: ${theme.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  &:last-child a {
    color: ${theme.active};
    text-decoration: none;
    cursor: pointer;
  }

  & + &::before {
    content: "›";
    color: ${theme.active};
  }
`;

const OpsSpan = styled.span`
  .ops {
    display: inline-block;
    line-height: 2em;
    padding: 0 8px;
    border-radius: 2px;
    background-color: ${theme.background};
    border: 1px solid ${theme.outline};
    color: #000;
    text-decoration: none;
  }

  .ops:hover {
    background-color: ${theme.outline};
    transition: background-color 0.25s ease-out;
    cursor: pointer;
  }

  .ops:active {
    background-color: ${theme.primary};
    color: ${theme.active};
    transition: background-color 0.5s ease-out, color 6s ease-out;
  }

  .ops:active {
    background-color: ${theme.primary};
    color: ${theme.active};
    transition: background-color 0.5s ease-out, color 6s ease-out;
  }

  .ops:not(:last-child) {
    margin-right: 10px;
  }
`;

// Convert simple links to next style href + as
export const BrowseLink = ({
  to,
  children,
  basepath,
}: {
  to: string;
  children: React.ReactElement;
  basepath: string;
}) => (
  <NextLink
    href={{ pathname: basepath, query: { viewPath: to } }}
    as={basepath + "/" + to}
  >
    {children}
  </NextLink>
);

export interface BrowseHeaderProps {
  path: string;
  basepath: string;
  type: string;
  hideCode: boolean;
  hideHome: boolean;
  onToggleHide?: () => void;
  s3Bucket?: string;
  s3Key?: string;
  versionId?: string;
}

interface BrowseHeaderState {
  versionIsOpen: boolean;
}

class BrowseHeader extends React.Component<
  BrowseHeaderProps,
  BrowseHeaderState
> {
  static defaultProps = {
    active: "view",
    hideCode: false,
    hideHome: false,
  };

  constructor(props: BrowseHeaderProps) {
    super(props);
    this.state = { versionIsOpen: false };
  }

  handleItemClick = (
    _e: React.SyntheticEvent<any>,
    { name }: { name: string }
  ) => {
    Router.push(name);
  };

  render() {
    const { path, basepath, versionId } = this.props;
    let paths = trim(path, "/").split("/");
    // Empty path to start off
    if (paths.length === 1 && paths[0] === "") {
      paths = [];
    }

    const viewingNotebook = path.endsWith(".ipynb");
    // TODO: Ensure this works under an app subpath (which is not implemented yet)
    const filePath =
      basepath.replace(/view(\/?)/, "files/") +
      path +
      `${versionId ? "?VersionId=" + versionId : ""}`;

    return (
      <Nav>
        <BreadCrumbs>
          {!this.props.hideHome && (
            <BreadCrumbItem>
              <BrowseLink to={``} basepath={basepath}>
                <a>
                  <span>home</span>
                </a>
              </BrowseLink>
            </BreadCrumbItem>
          )}
          {paths.map((name, index) => {
            const filePath = paths.slice(0, index + 1).join("/");
            return (
              <BreadCrumbItem key={`${filePath}`}>
                <BrowseLink to={`${filePath}`} basepath={basepath}>
                  <a>
                    <span>{name}</span>
                  </a>
                </BrowseLink>
              </BreadCrumbItem>
            );
          })}
        </BreadCrumbs>
        {this.props.type === "directory" ? null : (
          <OpsSpan>
            {viewingNotebook ? (
              <React.Fragment>
                <HideCodeButton
                  codeHidden={this.props.hideCode}
                  onToggleHide={this.props.onToggleHide}
                />
                <CloneButton
                  s3Bucket={this.props.s3Bucket}
                  s3Key={this.props.s3Key}
                  versionId={this.props.versionId}
                  relpath={this.props.path}
                />
              </React.Fragment>
            ) : null}
            <a href={filePath} download className="ops">
              Download
            </a>
            {this.props.s3Bucket ? (
              <a className="ops" onClick={this.handleOpen}>
                Show Versions
              </a>
            ) : null}
          </OpsSpan>
        )}
        {this.props.s3Bucket && this.props.type !== "directory" ? (
          <VersionDrawer
            {...this.props}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            versionIsOpen={this.state.versionIsOpen}
          />
        ) : null}
      </Nav>
    );
  }
  private handleOpen = () => this.setState({ versionIsOpen: true });
  private handleClose = () => this.setState({ versionIsOpen: false });
}

export default BrowseHeader;
