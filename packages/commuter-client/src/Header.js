import React from "react";
import logo from "./static/logo.png";

import { Divider, Image } from "semantic-ui-react";

import { css } from "aphrodite";

import { styles } from "./stylesheets/commuter";

export default () => (
  <div>
    <Image src={logo} size="small" />
    <Divider className={css(styles.divider)} section />
  </div>
);
