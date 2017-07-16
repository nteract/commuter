// @flow
import { Menu, Image, Container } from "semantic-ui-react";

type BodyProps = {
  // children: any // literally what's in the flow libdef, we expect a React Element
  children: React$Element<*>
};

const Body = (props: BodyProps) => {
  return (
    <div>
      <div className="main-container">
        <Container>
          {props.children}
        </Container>
      </div>
    </div>
  );
};

export default Body;
