import React, { PropTypes as T } from "react";
import { Breadcrumb } from "semantic-ui-react";
import { trim } from "lodash";

const BreadCrumb = props => {
  const { path, basepath, onClick } = props;
  const paths = trim(path, "/").split("/");
  let breadCrumbs = [];

  const handleClick = path =>
    e => {
      if (onClick) {
        e.preventDefault();
        onClick(path);
      }
    };

  breadCrumbs.push(
    <Breadcrumb.Section key="home">
      <a href={`${basepath}/`} onClick={handleClick(`${basepath}/`)}>
        /
      </a>
    </Breadcrumb.Section>
  );
  paths.forEach((name, index) => {
    const filePath = paths.slice(0, index + 1).join("/");
    breadCrumbs.push(
      <Breadcrumb.Divider key={`divider-${index}`} icon="right angle" />
    );
    // last index
    if (index == paths.length - 1)
      breadCrumbs.push(
        <Breadcrumb.Section key={`section-${index}`} active>
          {name}
        </Breadcrumb.Section>
      );
    else
      breadCrumbs.push(
        <Breadcrumb.Section key={`section-${index}`}>
          <a
            href={`${basepath}/${filePath}/`}
            onClick={handleClick(`${basepath}/${filePath}/`)}
          >
            {name}
          </a>
        </Breadcrumb.Section>
      );
  });
  return (
    <Breadcrumb>
      {breadCrumbs}
    </Breadcrumb>
  );
};

BreadCrumb.propTypes = { path: T.string.isRequired, onClick: T.func };

export default BreadCrumb;
