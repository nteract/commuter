import React from "react";
import { Breadcrumb } from "semantic-ui-react";
import { Link } from "react-router";
import _ from "lodash";

const BreadCrumb = props => {
  const paths = _.trim(props.path, "/").split("/");
  let result = [];
  paths.forEach((name, index) => {
    const fullPath = paths.slice(0, index + 1).join("/");
    if (index == paths.length - 1) {
      result.push(
        (
          <Breadcrumb.Section key={`section-${index}`} active>
            {name}
          </Breadcrumb.Section>
        )
      );
    } else {
      result.push(
        (
          <Breadcrumb.Section key={`section-${index}`}>
            <Link to={`/${fullPath}/`}>{name}</Link>
          </Breadcrumb.Section>
        )
      );
      result.push(
        <Breadcrumb.Divider key={`divider-${index}`} icon="right angle" />
      );
    }
  });
  return (
    <Breadcrumb>
      {result}
    </Breadcrumb>
  );
};

export default BreadCrumb;
