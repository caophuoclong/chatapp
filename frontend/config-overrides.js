const {
  override, useBabelRc,

} = require("customize-cra");
const path = require("path");

module.exports = override(
  // override the webpack config hereus
  useBabelRc()
);