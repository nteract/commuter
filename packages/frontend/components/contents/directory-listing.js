// @flow
import React from "react";
import { Icon } from "semantic-ui-react";

import Link from "next/link";

import { theme } from "../../theme";

import type { Content } from "./types";
import TimeAgo from "react-timeago";

export type DirectoryListingProps = {
  contents: Array<Content>,
  basepath: string
};

const DirectoryListing = (props: DirectoryListingProps) => {
  const base = props.basepath || "/";
  console.log(props);

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
                <tr key={index}>
                  <td className="icon">{icon}</td>
                  <td className="name">
                    <Link
                      href={{
                        pathname: "/view",
                        query: { viewPath: row.path }
                      }}
                      as={base + "/" + row.path}
                    >
                      <a>{row.name}</a>
                    </Link>
                  </td>
                  <td className="timeago">
                    <TimeAgo date={row.last_modified} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <style jsx>
        {`
          .icon {
            padding-right: 2px;
            padding-left: 10px;
            width: 17px;
          }
          .name {
            color: ${theme.link};
          }

          td {
            padding: 6px 3px;
            text-align: left;
            line-height: 20px;
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

          .timeago {
            text-align: right;
            color: #6a737d;
          }

          td a:hover {
            outline-width: 0;
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
};

export default DirectoryListing;
