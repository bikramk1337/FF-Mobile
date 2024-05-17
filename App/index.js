import React from "react";
import Navigation from "./config/Navigation";
import { RootSiblingParent } from "react-native-root-siblings";

import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

export default () => (
  <RootSiblingParent>
    <Navigation />
  </RootSiblingParent>
);
