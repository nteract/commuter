// @flow
import React from "react";

import octicons from "../../icons/octicons";

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
                row.type === "notebook" ? (
                  <octicons.Book />
                ) : row.type === "directory" ? (
                  <octicons.FileDirectory />
                ) : (
                  <octicons.FileText />
                );

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
            vertical-align: middle;
            text-align: center;
            color: rgba(3,47,98,0.5);
          }

          .name {
            color: ${theme.link};
            vertical-align: middle;
          }

          td {
            color: ${theme.link}
            padding: 6px 3px;
            text-align: left;
            line-height: 20px;
            border-top: 1px solid #eaecef;
            vertical-align: top;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
          }

          td a {
            text-decoration: none;
            color: ${theme.link};
          }

          td a:hover {
            text-decoration: underline;
            outline-width: 0;
            color: ${theme.link};
          }

          tr:hover {
            background-color: #f6f8fa;
            transition: background-color 0.1s ease-out;
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
            padding-right: 10px;
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
