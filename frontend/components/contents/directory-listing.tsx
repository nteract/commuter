import * as React from "react";

import Link from "next/link";
import styled from "styled-components";

import { theme } from "../../theme";

import { groupBy } from "lodash";
import {
  Entry,
  Listing,
  Icon,
  Name,
  LastSaved
} from "@nteract/directory-listing";

import { Content } from "../../../backend/dist/types";

export type DirectoryListingProps = {
  contents: Array<Content>;
  basepath: string;
};

const LetterHeader = styled.div`
  .letterHeader {
    padding-top: 1em;
    padding-bottom: 0.5em;
    padding-left: 6px;
  }
`;

// only appears when needing to navigate through directories with more than 25 entries.
const LetterNav = styled.div`
  padding-bottom: 1em;
  padding-left: 6px;

  a {
    text-decoration: none;
    padding-right: 1em;
    color: ${theme.link};
  }
`;

const GroupedDirectoryListings = (props: DirectoryListingProps) => {
  const contents = props.contents.filter(row => !row.name.startsWith("."));

  if (contents.length <= 25) {
    return <DirectoryListing contents={contents} basepath={props.basepath} />;
  }

  const groups = groupBy(contents, item => item.name[0].toUpperCase());
  // Filter out dotfiles
  delete groups["."];

  if (Object.keys(groups).length <= 1) {
    return <DirectoryListing contents={contents} basepath={props.basepath} />;
  }

  const groupNames = Object.keys(groups).sort();

  const listings = groupNames.map(key => (
    <div key={key}>
      <LetterHeader id={`group-${key}`}>{key}</LetterHeader>
      <DirectoryListing contents={groups[key]} basepath={props.basepath} />
    </div>
  ));

  return (
    <React.Fragment>
      <LetterNav>
        {groupNames.map(x => (
          <a href={`#group-${x}`} key={x}>
            {x.toUpperCase()}
          </a>
        ))}
      </LetterNav>
      {listings}
    </React.Fragment>
  );
};

const DirectoryListing = (props: DirectoryListingProps) => {
  const basepath = props.basepath || "/";

  // filter out dotfiles
  const contents = props.contents.filter(entry => !entry.name.startsWith("."));

  return (
    <React.Fragment>
      <Listing>
        {contents.map((entry, index) => {
          const link = (
            <Link
              href={{
                pathname: basepath,
                query: { viewPath: entry.path }
              }}
              as={basepath + "/" + entry.path}
            >
              <a>{entry.name}</a>
            </Link>
          );
          return (
            <Entry key={index}>
              <Icon fileType={entry.type} />
              <Name>{link}</Name>
              <LastSaved lastModified={entry.last_modified} />
            </Entry>
          );
        })}
      </Listing>
    </React.Fragment>
  );
};

export default GroupedDirectoryListings;

// export default DirectoryListing;
