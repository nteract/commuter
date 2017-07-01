import React, { PropTypes as T } from "react";
import { Breadcrumb } from "semantic-ui-react";
import { trim } from "lodash";

import { Link } from "react-router-dom";

const BreadCrumb = props => {
  const { path, basepath } = props;
  const paths = trim(path, "/").split("/");
  let breadCrumbs = [];

  breadCrumbs.push(
    <Breadcrumb.Section key="home">
      <Link
        to={`${basepath}/`}
        style={{ display: "block", width: "2em", height: "2em" }}
      >
        /
      </Link>
    </Breadcrumb.Section>
  );
  paths.forEach((name, index) => {
    const filePath = paths.slice(0, index + 1).join("/");
    breadCrumbs.push(
      <Breadcrumb.Divider key={`divider-${index}`} icon="right angle" />
    );
    // last index
    if (index === paths.length - 1)
      breadCrumbs.push(
        <Breadcrumb.Section key={`section-${index}`} active>
          {name}
        </Breadcrumb.Section>
      );
    else
      breadCrumbs.push(
        <Breadcrumb.Section key={`section-${index}`}>
          <Link to={`${basepath}/${filePath}/`}>
            {name}
          </Link>
        </Breadcrumb.Section>
      );
  });
  return (
    <Breadcrumb>
      {breadCrumbs}
    </Breadcrumb>
  );
};

BreadCrumb.propTypes = { path: T.string.isRequired };

export default BreadCrumb;
