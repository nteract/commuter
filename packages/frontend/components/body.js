import { Menu, Image, Container } from "semantic-ui-react";

const Body = props => {
  return (
    <div>
      <div className="main-container">
        <Container>
          {props.children}
        </Container>
      </div>
      <style jsx>{`
        .main-container {
          margin-top: 3rem;
        }
      `}</style>
    </div>
  );
};

export default Body;
