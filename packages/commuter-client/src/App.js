import React, { PropTypes as T } from "react";
import { Container, Divider, Image } from "semantic-ui-react";
import { StyleSheet, css } from "aphrodite";

import Dashboard from "commuter-dashboard";
import BreadCrumb from "commuter-breadcrumb";

import { serverConfig } from "./config";
import logo from "./static/logo.png";

const styles = StyleSheet.create({
  outerContainer: { fontFamily: "sans-serif" },
  innerContainer: { paddingTop: "10px" },
  divider: { marginTop: "0rem" }
});

export default class App extends React.Component {
  static propTypes = { location: T.shape({ pathname: T.string }).isRequired };
  render() {
    const { pathname } = this.props.location;
    return (
      <Container className={css(styles.outerContainer)}>
        <Image src={logo} size="small" />
        <Divider className={css(styles.divider)} section />
        <BreadCrumb path={pathname} />
        <Container className={css(styles.innerContainer)} textAlign="center">
          <Dashboard serverConfig={serverConfig} path={pathname} />
        </Container>
      </Container>
    );
  }
}
