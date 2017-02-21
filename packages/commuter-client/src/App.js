import React from "react";
import { Container } from "semantic-ui-react";

import Header from './Header';

class App extends React.Component {
  render() {
    return (
      <Container>
        <Header />
        {this.props.children}
      </Container>
    );
  }
}

export default App;
