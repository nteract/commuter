import React, { PropTypes as T } from "react";
import { Breadcrumb } from "semantic-ui-react";
import { trim } from "lodash";

const BreadCrumb = props => {
  const { path, onClick } = props;
  const paths = trim(path, "/").split("/");
  let breadCrumbs = [];

  const handleClick = path => e => {
    if (onClick) {
      e.preventDefault();
      onClick(path);
    }
  };

  breadCrumbs.push(
    <Breadcrumb.Section key="home">
      <a href="/" onClick={handleClick("/")}>
        Home
      </a>
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
          <a href={`/${fullPath}/`} onClick={handleClick(`/${fullPath}/`)}>
            {name}
          </a>
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

BreadCrumb.propTypes = { path: T.string.isRequired, onClick: T.func };

export default BreadCrumb;
