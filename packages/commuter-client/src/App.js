import React from "react";
import { Container } from "semantic-ui-react";

import Header from "./Header";

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default App;
