import React, { PropTypes as T } from "react";
import { Breadcrumb } from "semantic-ui-react";
import { Link } from "react-router";
import { trim } from "lodash";

const BreadCrumb = props => {
  const paths = trim(props.path, "/").split("/");
  let breadCrumbs = [];
  breadCrumbs.push(
    <Breadcrumb.Section key="home">
      <Link to="/">
        Home
      </Link>
    </Breadcrumb.Section>
  );
  paths.forEach((name, index) => {
    const fullPath = paths.slice(0, index + 1).join("/");
    breadCrumbs.push(
      <Breadcrumb.Divider key={`divider-${index}`} icon="right angle" />
    );
    // last index
    if (index == paths.length - 1) {
      breadCrumbs.push(
        <Breadcrumb.Section key={`section-${index}`} active>
          {name}
        </Breadcrumb.Section>
      );
    } else {
      breadCrumbs.push(
        <Breadcrumb.Section key={`section-${index}`}>
          <Link to={`/${fullPath}/`}>{name}</Link>
        </Breadcrumb.Section>
      );
    }
  });
  return (
    <Breadcrumb>
      {breadCrumbs}
    </Breadcrumb>
  );
};

BreadCrumb.propTypes = { path: T.string.isRequired };

export default BreadCrumb;
