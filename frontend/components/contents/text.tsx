import * as React from "react";
import styled from "styled-components";

const WrappedPre = styled.pre`
  white-space: pre-wrap;
`;

interface Props {
  entry: { content: string };
}

export default class TEXTView extends React.Component<Props> {
  render() {
    return <WrappedPre>{this.props.entry.content}</WrappedPre>;
  }
}
