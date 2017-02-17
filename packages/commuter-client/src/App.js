import React from "react";
import { Container } from "semantic-ui-react";

class App extends React.Component {
  render() {
    return (
      <Container>
        {this.props.children}
      </Container>
    );
  }
}

export default App;
