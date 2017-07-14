import { Menu, Image, Container } from "semantic-ui-react";

const Body = props => {
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
