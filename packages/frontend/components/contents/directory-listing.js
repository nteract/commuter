// @flow
import React from "react";
import { Icon } from "semantic-ui-react";

import NextLink from "next/link";

import { theme } from "../../theme";

// Convert simple links to next style href + as
const Link = ({ to, children, basepath }) => (
  <NextLink
    href={{ pathname: "/view", query: { viewPath: to } }}
    as={basepath + "/" + to}
  >
    <a>{children}</a>
  </NextLink>
);

import type { Content } from "./types";

export type DirectoryListingProps = {
  contents: Array<Content>,
  basepath: string
};

const DirectoryListing = (props: DirectoryListingProps) => {
  const base = props.basepath || "/";

  // filter out dotfiles
  const contents = props.contents.filter(row => !row.name.startsWith("."));

  return (
    <div>
      <div className="directory-listing">
        <table>
          <tbody>
            {contents.map((row, index) => {
              if (
                !row.type ||
                (row.type !== "notebook" &&
                  row.type !== "directory" &&
                  row.type !== "file")
              ) {
                return null;
              }

              const icon =
                row.type === "notebook"
                  ? "📘"
                  : row.type === "directory" ? "📁" : "📃";

              return (
                <tr>
                  <td>{icon}</td>
                  <td>
                    <Link to={row.path} basepath={base}>
                      {row.name}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <style jsx>
        {`
          tr {
          }
          td {
            padding: 6px 3px;
            text-align: left;
            line-height: 20px;
            color: ${theme.link};
            border-top: 1px solid #eaecef;
            vertical-align: top;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 2px;
            border-spacing: 0;
          }

          .directory-listing {
            margin-bottom: 10px;
            border: 1px solid #dfe2e5;
            border-top: 0;
            border-radius: 3px;
          }
        `}
      </style>
    </div>
  );
};

export default DirectoryListing;
