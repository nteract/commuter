import * as React from "react";

type BodyProps = {
  children?: React.ReactNode;
};

const Body = (props: BodyProps) => {
  return props.children;
};

export default Body;
