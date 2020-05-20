import * as React from "react";
import styled from "styled-components";

const Link = styled.a`
  /* The class "ops" places a margin-right of 10px that needs to be overwritten */
  margin-right: 0px !important;
`;

type HideCodeButtonProps = {
  codeHidden: boolean;
  onToggleHide?: () => void;
};

class HideCodeButton extends React.PureComponent<HideCodeButtonProps> {
  handleToggle = () => {
    if (this.props.onToggleHide) {
      this.props.onToggleHide();
    }
  };

  render() {
    return (
      <Link className="ops" onClick={this.handleToggle}>
        {this.props.codeHidden ? "Show Code" : "Hide Code"}
      </Link>
    );
  }
}

export default HideCodeButton;
